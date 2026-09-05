// Telegram, Facebook, Pinterest, LinkedIn, Twitter/X & WhatsApp Auto-Posting Service for DeshReport

export type SocialPlatform = 'telegram' | 'facebook' | 'pinterest' | 'linkedin' | 'twitter' | 'whatsapp';

export interface SocialPublishResult {
  platform: SocialPlatform;
  success: boolean;
  message: string;
  timestamp: string;
  postId?: string;
  url?: string;
}

export interface SocialConfig {
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  facebookEnabled: boolean;
  facebookPageId: string;
  facebookAccessToken: string;
  pinterestEnabled: boolean;
  pinterestBoardId: string;
  pinterestAccessToken: string;
  linkedinEnabled: boolean;
  linkedinAccessToken: string;
  linkedinAuthorUrn: string;
  twitterEnabled: boolean;
  twitterBearerToken: string;
  twitterWebhookUrl: string;
  whatsappEnabled: boolean;
  whatsappWebhookUrl: string;
  whatsappChannelLink: string;
  autoPublishIntervalMinutes: number;
}

// Retrieve stored social configuration from localStorage or environment variables
export const getStoredSocialConfig = (): SocialConfig => {
  try {
    const saved = localStorage.getItem('deshreport_social_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        telegramEnabled: parsed.telegramEnabled ?? true,
        telegramBotToken: parsed.telegramBotToken || '',
        telegramChatId: parsed.telegramChatId || '',
        facebookEnabled: parsed.facebookEnabled ?? true,
        facebookPageId: parsed.facebookPageId || '',
        facebookAccessToken: parsed.facebookAccessToken || '',
        pinterestEnabled: parsed.pinterestEnabled ?? false,
        pinterestBoardId: parsed.pinterestBoardId || '',
        pinterestAccessToken: parsed.pinterestAccessToken || '',
        linkedinEnabled: parsed.linkedinEnabled ?? false,
        linkedinAccessToken: parsed.linkedinAccessToken || '',
        linkedinAuthorUrn: parsed.linkedinAuthorUrn || '',
        twitterEnabled: parsed.twitterEnabled ?? false,
        twitterBearerToken: parsed.twitterBearerToken || '',
        twitterWebhookUrl: parsed.twitterWebhookUrl || '',
        whatsappEnabled: parsed.whatsappEnabled ?? false,
        whatsappWebhookUrl: parsed.whatsappWebhookUrl || '',
        whatsappChannelLink: parsed.whatsappChannelLink || '',
        autoPublishIntervalMinutes: parsed.autoPublishIntervalMinutes || 15
      };
    }
  } catch (_) {}

  return {
    telegramEnabled: true,
    telegramBotToken: (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || '',
    telegramChatId: (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID || '',
    facebookEnabled: true,
    facebookPageId: (import.meta as any).env?.VITE_FACEBOOK_PAGE_ID || '',
    facebookAccessToken: (import.meta as any).env?.VITE_FACEBOOK_ACCESS_TOKEN || '',
    pinterestEnabled: false,
    pinterestBoardId: '',
    pinterestAccessToken: '',
    linkedinEnabled: false,
    linkedinAccessToken: '',
    linkedinAuthorUrn: '',
    twitterEnabled: false,
    twitterBearerToken: '',
    twitterWebhookUrl: '',
    whatsappEnabled: false,
    whatsappWebhookUrl: '',
    whatsappChannelLink: '',
    autoPublishIntervalMinutes: 15
  };
};

export const saveSocialConfig = (config: SocialConfig): void => {
  try {
    localStorage.setItem('deshreport_social_config', JSON.stringify(config));
  } catch (_) {}
};

// Auto-Post History Logs
export interface SocialLog {
  id: string;
  articleTitle: string;
  articleSlug: string;
  imageUrl?: string;
  platform: SocialPlatform;
  status: 'success' | 'failed';
  message: string;
  timestamp: string;
}

export const getSocialLogs = (): SocialLog[] => {
  try {
    const saved = localStorage.getItem('deshreport_social_logs');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return [];
};

export const appendSocialLog = (log: Omit<SocialLog, 'id'>): void => {
  try {
    const current = getSocialLogs();
    const newEntry: SocialLog = {
      ...log,
      id: 'soc-log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    const updated = [newEntry, ...current.slice(0, 99)];
    localStorage.setItem('deshreport_social_logs', JSON.stringify(updated));
  } catch (_) {}
};

const getArticleUrl = (slug: string) => {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://desh-report.vercel.app';
  return `${origin}/article/${slug}`;
};

/**
 * Send an article with image directly to a Telegram Channel or Group
 */
export const postToTelegram = async (
  article: { title: string; summary?: string; slug: string; featuredImage?: string },
  botToken: string,
  chatId: string
): Promise<SocialPublishResult> => {
  const timestamp = new Date().toLocaleTimeString('bn-BD');
  let cleanToken = (botToken || '').trim();
  let cleanChatId = (chatId || '').trim();

  // If user typed channel username without '@' and it's not a numeric ID
  if (cleanChatId && !cleanChatId.startsWith('@') && !/^-?\d+$/.test(cleanChatId)) {
    cleanChatId = '@' + cleanChatId;
  }

  if (!cleanToken || !cleanChatId) {
    return {
      platform: 'telegram',
      success: false,
      message: 'টেলিগ্রাম Bot Token অথবা Channel ID কনফিগার করা নেই। সেটিংস থেকে সেট করুন।',
      timestamp
    };
  }

  const articleUrl = getArticleUrl(article.slug);
  const captionText = `🚨 <b>${article.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</b>\n\n${
    article.summary ? article.summary.slice(0, 280).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '...\n\n' : ''
  }🔗 <a href="${articleUrl}">সম্পূর্ণ খবর পড়ুন (দেশরিপোর্ট)</a>\n\n#DeshReport #BangladeshNews #BreakingNews`;

  try {
    let endpoint = `https://api.telegram.org/bot${cleanToken}/sendPhoto`;
    let body: any = {
      chat_id: cleanChatId,
      caption: captionText,
      parse_mode: 'HTML'
    };

    if (article.featuredImage && article.featuredImage.startsWith('http')) {
      body.photo = article.featuredImage;
    } else {
      endpoint = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
      body = {
        chat_id: cleanChatId,
        text: captionText,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      };
    }

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    let data = await response.json();

    // Fallback: If sendPhoto failed with media/network error, try sending as text message
    if (!data.ok && endpoint.includes('sendPhoto')) {
      const fallbackEndpoint = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
      const fallbackBody = {
        chat_id: cleanChatId,
        text: captionText,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      };
      try {
        const fbResponse = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallbackBody)
        });
        const fbData = await fbResponse.json();
        if (fbData.ok) {
          data = fbData;
        }
      } catch (_) {}
    }

    if (data.ok) {
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'telegram',
        status: 'success',
        message: 'টেলিগ্রাম চ্যানেলে ছবিসহ সফলভাবে পোস্ট করা হয়েছে!',
        timestamp
      });

      return {
        platform: 'telegram',
        success: true,
        message: 'টেলিগ্রাম চ্যানেলে ছবিসহ সফলভাবে পোস্ট প্রকাশিত হয়েছে!',
        postId: data.result?.message_id?.toString(),
        timestamp
      };
    } else {
      let errDetail = data.description || 'Unknown Telegram API error';
      let userFriendlyHint = errDetail;

      if (errDetail.includes("bot can't initiate conversation with a user")) {
        userFriendlyHint = "টেলিগ্রামের নিরাপত্তা নিয়ম অনুযায়ী বট কোনো ইউজারের সাথে নিজে থেকে মেসেজ শুরু করতে পারে না। \n👉 সমাধান ১ (ব্যক্তিগত আইডি): টেলিগ্রামে আপনার বটের ইউজারনেম সার্চ করে চ্যাটে গিয়ে 'Start' বাটন বা '/start' পাঠান। \n👉 সমাধান ২ (চ্যানেল/গ্রুপ): আপনার চ্যানেলে বটটিকে 'Administrator' হিসেবে অ্যাড করুন এবং এখানে চ্যানেলের ইউজারনেম (যেমন: @yourchannel) বা -100 দিয়ে শুরু আইডি দিন।";
      } else if (errDetail.includes("chat not found")) {
        userFriendlyHint = "চ্যাট বা চ্যানেল খুঁজে পাওয়া যায়নি। চ্যানেলের ক্ষেত্রে নামের শুরুতে '@' দিয়েছেন কিনা এবং বটটিকে চ্যানেলে অ্যাডমিন বানানো হয়েছে কিনা চেক করুন।";
      } else if (errDetail.includes("bot is not a member of the channel") || errDetail.includes("need administrator rights")) {
        userFriendlyHint = "বটটি চ্যানেলের অ্যাডমিন নয়। চ্যানেলের Settings > Administrators এ গিয়ে বটটিকে Admin হিসেবে যোগ করে 'Post Messages' অনুমতি দিন।";
      }

      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'telegram',
        status: 'failed',
        message: `টেলিগ্রাম ত্রুটি: ${errDetail}`,
        timestamp
      });

      return {
        platform: 'telegram',
        success: false,
        message: userFriendlyHint,
        timestamp
      };
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error occurred while contacting Telegram';
    appendSocialLog({
      articleTitle: article.title,
      articleSlug: article.slug,
      imageUrl: article.featuredImage,
      platform: 'telegram',
      status: 'failed',
      message: errorMsg,
      timestamp
    });

    return {
      platform: 'telegram',
      success: false,
      message: `সংযোগ ত্রুটি: ${errorMsg}`,
      timestamp
    };
  }
};

/**
 * Send an article with image directly to a Facebook Page
 */
export const postToFacebook = async (
  article: { title: string; summary?: string; slug: string; featuredImage?: string },
  pageId: string,
  accessToken: string
): Promise<SocialPublishResult> => {
  const timestamp = new Date().toLocaleTimeString('bn-BD');
  const cleanPageId = (pageId || '').trim();
  const cleanToken = (accessToken || '').trim();

  if (!cleanPageId || !cleanToken) {
    return {
      platform: 'facebook',
      success: false,
      message: 'ফেসবুক Page ID অথবা Page Access Token দেওয়া নেই। সেটিংস থেকে কনফিগার করুন।',
      timestamp
    };
  }

  const articleUrl = getArticleUrl(article.slug);
  const messageText = `${article.title}\n\n${article.summary || ''}\n\n👉 পুরো সংবাদটি পড়ুন: ${articleUrl}\n\n#DeshReport #Bangladesh #News #দেশেরসংবাদ`;

  try {
    let endpoint = `https://graph.facebook.com/v19.0/${cleanPageId}/photos`;
    const formData = new URLSearchParams();
    formData.append('access_token', cleanToken);
    formData.append('message', messageText);

    if (article.featuredImage && article.featuredImage.startsWith('http')) {
      formData.append('url', article.featuredImage);
    } else {
      endpoint = `https://graph.facebook.com/v19.0/${cleanPageId}/feed`;
      formData.append('link', articleUrl);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.id || data.post_id) {
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'facebook',
        status: 'success',
        message: 'ফেসবুক পেজে ছবিসহ সফলভাবে পোস্ট করা হয়েছে!',
        timestamp
      });

      return {
        platform: 'facebook',
        success: true,
        message: 'ফেসবুক পেজে ছবিসহ সফলভাবে পোস্ট করা হয়েছে!',
        postId: data.id || data.post_id,
        timestamp
      };
    } else {
      const fbError = data.error?.message || 'Failed to post on Facebook';
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'facebook',
        status: 'failed',
        message: `ফেসবুক ত্রুটি: ${fbError}`,
        timestamp
      });

      return {
        platform: 'facebook',
        success: false,
        message: `ফেসবুক API ত্রুটি: ${fbError}`,
        timestamp
      };
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error occurred while contacting Facebook';
    appendSocialLog({
      articleTitle: article.title,
      articleSlug: article.slug,
      imageUrl: article.featuredImage,
      platform: 'facebook',
      status: 'failed',
      message: errorMsg,
      timestamp
    });

    return {
      platform: 'facebook',
      success: false,
      message: `সংযোগ ত্রুটি: ${errorMsg}`,
      timestamp
    };
  }
};

/**
 * Send an article with image directly to Pinterest Pins (API v5)
 */
export const postToPinterest = async (
  article: { title: string; summary?: string; slug: string; featuredImage?: string },
  boardId: string,
  accessToken: string
): Promise<SocialPublishResult> => {
  const timestamp = new Date().toLocaleTimeString('bn-BD');
  const cleanBoardId = (boardId || '').trim();
  const cleanToken = (accessToken || '').trim();

  if (!cleanBoardId || !cleanToken) {
    return {
      platform: 'pinterest',
      success: false,
      message: 'পিন্টারেস্ট Board ID অথবা Access Token দেওয়া নেই। সেটিংস থেকে কনফিগার করুন।',
      timestamp
    };
  }

  const articleUrl = getArticleUrl(article.slug);
  const imageUrl = article.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80';

  try {
    const response = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: article.title.slice(0, 100),
        description: (article.summary || article.title).slice(0, 500) + `\n\nDeshReport: ${articleUrl}`,
        link: articleUrl,
        board_id: cleanBoardId,
        media_source: {
          source_type: 'image_url',
          url: imageUrl
        }
      })
    });

    const data = await response.json();

    if (response.ok && (data.id || data.pin_id)) {
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'pinterest',
        status: 'success',
        message: 'পিন্টারেস্টে সফলভাবে পিন তৈরি হয়েছে!',
        timestamp
      });

      return {
        platform: 'pinterest',
        success: true,
        message: 'পিন্টারেস্টে সফলভাবে ছবিসহ পিন পোস্ট করা হয়েছে!',
        postId: data.id || data.pin_id,
        url: `https://www.pinterest.com/pin/${data.id || data.pin_id}`,
        timestamp
      };
    } else {
      const pinError = data.message || data.error?.message || 'Pinterest API error';
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'pinterest',
        status: 'failed',
        message: `পিন্টারেস্ট ত্রুটি: ${pinError}`,
        timestamp
      });

      return {
        platform: 'pinterest',
        success: false,
        message: `পিন্টারেস্ট API ত্রুটি: ${pinError}`,
        timestamp
      };
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error occurred while contacting Pinterest';
    appendSocialLog({
      articleTitle: article.title,
      articleSlug: article.slug,
      imageUrl: article.featuredImage,
      platform: 'pinterest',
      status: 'failed',
      message: errorMsg,
      timestamp
    });

    return {
      platform: 'pinterest',
      success: false,
      message: `সংযোগ ত্রুটি: ${errorMsg}`,
      timestamp
    };
  }
};

/**
 * Send an article to LinkedIn (API v2 ugcPosts)
 */
export const postToLinkedIn = async (
  article: { title: string; summary?: string; slug: string; featuredImage?: string },
  accessToken: string,
  authorUrn: string
): Promise<SocialPublishResult> => {
  const timestamp = new Date().toLocaleTimeString('bn-BD');
  const cleanToken = (accessToken || '').trim();
  const cleanUrn = (authorUrn || '').trim();

  if (!cleanToken || !cleanUrn) {
    return {
      platform: 'linkedin',
      success: false,
      message: 'লিঙ্কডইন Access Token অথবা Author URN কনফিগার করা নেই।',
      timestamp
    };
  }

  const articleUrl = getArticleUrl(article.slug);

  try {
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: cleanUrn.startsWith('urn:li:') ? cleanUrn : `urn:li:person:${cleanUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: `${article.title}\n\n${article.summary || ''}\n\n👉 সম্পূর্ণ খবর: ${articleUrl}\n\n#DeshReport #BangladeshNews #News`
            },
            shareMediaCategory: 'ARTICLE',
            media: [
              {
                status: 'READY',
                description: { text: (article.summary || article.title).slice(0, 200) },
                originalUrl: articleUrl,
                title: { text: article.title }
              }
            ]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    const data = await response.json();

    if (response.ok && (data.id || response.status === 201)) {
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'linkedin',
        status: 'success',
        message: 'লিঙ্কডইনে সফলভাবে প্রকাশিত হয়েছে!',
        timestamp
      });
      return {
        platform: 'linkedin',
        success: true,
        message: 'লিঙ্কডইনে সফলভাবে পোস্ট হয়েছে!',
        postId: data.id,
        timestamp
      };
    } else {
      const err = data.message || 'LinkedIn share error';
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform: 'linkedin',
        status: 'failed',
        message: `লিঙ্কডইন ত্রুটি: ${err}`,
        timestamp
      });
      return { platform: 'linkedin', success: false, message: `লিঙ্কডইন ত্রুটি: ${err}`, timestamp };
    }
  } catch (err: any) {
    return { platform: 'linkedin', success: false, message: `সংযোগ ত্রুটি: ${err?.message}`, timestamp };
  }
};

/**
 * Send article to Webhook (for Twitter/X, WhatsApp, Zapier, Make, Pabbly)
 */
export const postToWebhook = async (
  platform: 'twitter' | 'whatsapp',
  webhookUrl: string,
  article: { title: string; summary?: string; slug: string; featuredImage?: string }
): Promise<SocialPublishResult> => {
  const timestamp = new Date().toLocaleTimeString('bn-BD');
  const cleanUrl = (webhookUrl || '').trim();

  if (!cleanUrl) {
    return {
      platform,
      success: false,
      message: `${platform === 'twitter' ? 'X (Twitter)' : 'WhatsApp'} Webhook URL দেওয়া নেই।`,
      timestamp
    };
  }

  const articleUrl = getArticleUrl(article.slug);

  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        event: 'new_article_published',
        title: article.title,
        summary: article.summary,
        url: articleUrl,
        imageUrl: article.featuredImage,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      appendSocialLog({
        articleTitle: article.title,
        articleSlug: article.slug,
        imageUrl: article.featuredImage,
        platform,
        status: 'success',
        message: `${platform === 'twitter' ? 'X (Twitter)' : 'WhatsApp'} এ সফলভাবে পুশ হয়েছে!`,
        timestamp
      });

      return {
        platform,
        success: true,
        message: `${platform === 'twitter' ? 'X (Twitter)' : 'WhatsApp'} Webhook এ সফলভাবে বার্তা পাঠানো হয়েছে!`,
        timestamp
      };
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err: any) {
    appendSocialLog({
      articleTitle: article.title,
      articleSlug: article.slug,
      imageUrl: article.featuredImage,
      platform,
      status: 'failed',
      message: `Webhook ত্রুটি: ${err?.message}`,
      timestamp
    });
    return {
      platform,
      success: false,
      message: `Webhook ত্রুটি: ${err?.message}`,
      timestamp
    };
  }
};

/**
 * Dispatch an article to all enabled channels (Telegram, Facebook, Pinterest, LinkedIn, Twitter, WhatsApp)
 */
export const autoPublishArticle = async (
  article: { title: string; summary?: string; slug: string; featuredImage?: string },
  customConfig?: SocialConfig
): Promise<SocialPublishResult[]> => {
  const config = customConfig || getStoredSocialConfig();
  const results: SocialPublishResult[] = [];

  // Telegram
  if (config.telegramEnabled && config.telegramBotToken && config.telegramChatId) {
    const tgResult = await postToTelegram(article, config.telegramBotToken, config.telegramChatId);
    results.push(tgResult);
  }

  // Facebook
  if (config.facebookEnabled && config.facebookPageId && config.facebookAccessToken) {
    const fbResult = await postToFacebook(article, config.facebookPageId, config.facebookAccessToken);
    results.push(fbResult);
  }

  // Pinterest
  if (config.pinterestEnabled && config.pinterestBoardId && config.pinterestAccessToken) {
    const pinResult = await postToPinterest(article, config.pinterestBoardId, config.pinterestAccessToken);
    results.push(pinResult);
  }

  // LinkedIn
  if (config.linkedinEnabled && config.linkedinAccessToken && config.linkedinAuthorUrn) {
    const liResult = await postToLinkedIn(article, config.linkedinAccessToken, config.linkedinAuthorUrn);
    results.push(liResult);
  }

  // Twitter/X Webhook
  if (config.twitterEnabled && config.twitterWebhookUrl) {
    const twResult = await postToWebhook('twitter', config.twitterWebhookUrl, article);
    results.push(twResult);
  }

  // WhatsApp Webhook
  if (config.whatsappEnabled && config.whatsappWebhookUrl) {
    const waResult = await postToWebhook('whatsapp', config.whatsappWebhookUrl, article);
    results.push(waResult);
  }

  return results;
};
