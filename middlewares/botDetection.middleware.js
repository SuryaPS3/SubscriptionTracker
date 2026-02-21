// Cloudflare Bot Detection Middleware
// This middleware uses Cloudflare's free bot detection headers

export const cloudflareBotsDetection = (req, res, next) => {
    // Cloudflare bot score (0-99, where lower is more likely to be a bot)
    const cfBotScore = req.headers['cf-bot-management-score'];
    
    // Cloudflare's bot detection result
    const cfBotManagement = req.headers['cf-bot-management'];
    
    // Check if request is coming through Cloudflare
    const cfRay = req.headers['cf-ray'];
    const cfConnectingIP = req.headers['cf-connecting-ip'];
    
    // If not coming through Cloudflare, continue (for local development)
    if (!cfRay && process.env.NODE_ENV === 'development') {
        return next();
    }
    
    // Log bot detection info for monitoring
    console.log('Bot Detection Info:', {
        ip: cfConnectingIP || req.ip,
        userAgent: req.headers['user-agent'],
        cfBotScore,
        cfBotManagement,
        cfRay,
        path: req.path
    });
    
    // Block requests with very low bot scores (likely bots)
    if (cfBotScore && parseInt(cfBotScore) < 30) {
        return res.status(403).json({
            success: false,
            error: 'Access denied: Suspicious activity detected',
            code: 'BOT_DETECTED'
        });
    }
    
    // Check for known bot management flags
    if (cfBotManagement && cfBotManagement.includes('verified_bot=false')) {
        return res.status(403).json({
            success: false,
            error: 'Access denied: Bot activity detected',
            code: 'BOT_MANAGEMENT_BLOCK'
        });
    }
    
    // Additional basic bot detection for non-Cloudflare requests
    const userAgent = req.headers['user-agent'] || '';
    const suspiciousBotPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python-requests/i,
        /postman/i // Remove this in production if you use Postman for testing
    ];
    
    // Only apply strict bot detection in production
    if (process.env.NODE_ENV === 'production') {
        for (const pattern of suspiciousBotPatterns) {
            if (pattern.test(userAgent)) {
                console.warn('Potential bot detected:', {
                    ip: cfConnectingIP || req.ip,
                    userAgent,
                    path: req.path
                });
                
                // You might want to allow certain bots (like search engines)
                // For now, we'll just log and continue, but you can block them here
                break;
            }
        }
    }
    
    // Add bot detection info to request for further processing
    req.botInfo = {
        score: cfBotScore ? parseInt(cfBotScore) : null,
        management: cfBotManagement,
        isCloudflare: !!cfRay,
        ip: cfConnectingIP || req.ip
    };
    
    next();
};

// Middleware to block requests without proper headers (stricter version)
export const strictBotDetection = (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    const acceptHeader = req.headers['accept'];
    
    // Block requests without user agent
    if (!userAgent) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request: User agent required',
            code: 'NO_USER_AGENT'
        });
    }
    
    // Block requests without accept header
    if (!acceptHeader) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request: Accept header required',
            code: 'NO_ACCEPT_HEADER'
        });
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
        /^$/,                    // Empty user agent
        /^Mozilla\/5\.0$/,       // Incomplete Mozilla string
        /^python/i,              // Python scripts
        /^java/i,                // Java applications
        /^go-http-client/i,      // Go HTTP client
        /^node/i                 // Node.js requests
    ];
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(userAgent)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied: Automated request detected',
                code: 'AUTOMATED_REQUEST_BLOCKED'
            });
        }
    }
    
    next();
};