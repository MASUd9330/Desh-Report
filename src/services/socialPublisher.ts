// Telegram & Facebook Auto-Posting Service with Image Support for DeshReport

export interface SocialPublishResult {
  platform: 'telegram' | 'facebook';
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
}

// Retrieve stored social configuration from localStorage or environment variables
export const getStoredSocialConfig = (): SocialConfig => {
  try {
    const saved = localStorage.getItem('deshreport_social_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (_) {}

  return {
    telegramEnabled: true,
    telegramBotToken: (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || '',
    telegramChatId: (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID || '',
    facebookEnabled: true,
    facebookPageId: (import.meta as any).env?.VITE_FACEBOOK_PAGE_ID || '',
    facebookAccessToken: (import.meta as any).env?.VITE_FACEBOOK_ACCESS_TOKEN || ''
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
  platform: 'telegram' | 'facebook';
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
    const updated = [newEntry, ...current.slice(0, 49)];
    localStorage.setItem('deshreport_social_logs', JSON.stringify(updated));
  } catch (_) {}
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
  const cleanToken = (botToken || '').trim();
  const cleanChatId = (chatId || '').trim();

  if (!cleanToken || !cleanChatId) {
    return {
      platform: 'telegram',
      success: false,
      message: 'টেলিগ্রাম Bot Token অথবা Channel ID কনফিগার করা নেই। সেটিংস থেকে সেট করুন।',
      timestamp
    };
  }

  const articleUrl = `https://deshreport.netlify.app/article/${article.slug}`;
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

    // If an image URL exists, send as Photo. Otherwise send as Message
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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

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
      const errDetail = data.description || 'Unknown Telegram API error';
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
        message: `টেলিগ্রাম API ত্রুটি: ${errDetail}`,
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

  const articleUrl = `https://deshreport.netlify.app/article/${article.slug}`;
  const messageText = `${article.title}\n\n${article.summary || ''}\n\n👉 পুরো সংবাদটি পড়ুন: ${articleUrl}\n\n#DeshReport #Bangladesh #News #দেশেরসংবাদ`;

  try {
    let endpoint = `https://graph.facebook.com/v19.0/${cleanPageId}/photos`;
    const formData = new URLSearchParams();
    formData.append('access_token', cleanToken);
    formData.append('message', messageText);

    if (article.featuredImage && article.featuredImage.startsWith('http')) {
      formData.append('url', article.featuredImage);
    } else {
      // Fallback to feed post if no direct photo
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
 * Dispatch an article to all enabled channels (Telegram & Facebook)
 */
export const autoPublishArticle = async (
  article: { title: string; summary?: string; slug: string; featuredImage?: string },
  customConfig?: SocialConfig
): Promise<SocialPublishResult[]> => {
  const config = customConfig || getStoredSocialConfig();
  const results: SocialPublishResult[] = [];

  if (config.telegramEnabled && config.telegramBotToken && config.telegramChatId) {
    const tgResult = await postToTelegram(article, config.telegramBotToken, config.telegramChatId);
    results.push(tgResult);
  }

  if (config.facebookEnabled && config.facebookPageId && config.facebookAccessToken) {
    const fbResult = await postToFacebook(article, config.facebookPageId, config.facebookAccessToken);
    results.push(fbResult);
  }

  return results;
};
