
// push Notications Satrt
// publicnotifications([device], msgtext, 'ZTI1ZjFjZjUtZjZkMS00OTE3LWJjNmYtZDk1MDBmMmZiYmI0', 'e348edeb-c5b4-4326-91c0-4b909d061a10', "notificationsound", "ic_stat_onesignal_default", titleHeading);


/***
 * 
 * PUSH NOTIFICATIONS ANDROID AND IOS
 * Your App ID: e348edeb-c5b4-4326-91c0-4b909d061a10
 * OneSignal App ID:e348edeb-c5b4-4326-91c0-4b909d061a10
 * Rest API Key: ZTI1ZjFjZjUtZjZkMS00OTE3LWJjNmYtZDk1MDBmMmZiYmI0
 */

const https = require('https');

exports.pushnotifications = function (device, msgtext, seckey, appid, sound, small_icon, titleHeading) {
    console.log(titleHeading);
    var restKey = '';
    var respon;
    var appID = '';
    var message = {
        "android_visibility": 1,
        "android_sound": sound,
        "sound": sound,
        app_id: appid,
        // "big_picture": "https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg",
        // "large_icon": "https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg",
        "small_icon": small_icon,
        contents: { "en": msgtext },
        "headings": {
            "en": titleHeading
        },
        // "android_channel_id": android_channel_id,
        include_player_ids: device,
        "priority": 10,
        "playSound": true,
        // "ios_attachments":"https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg"
    };

    var headers = {
        "Content-Type": "application/json;",
        "Authorization": "Basic " + seckey
    };
    //console.log("1 player id=>" + device);
    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };
    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            respon = data;
        });
    });
    req.on('error', function (e) {
        console.log(e);
    });
    req.write(JSON.stringify(message));
    req.end();
}
// Push Notications End


exports.pushnotificationser = function (deviceId, messageText, secretKey, appId, sound, smallIcon, title ) {
    
    console.log(title)
    if (!deviceId) {
        console.error("Invalid Device ID:", deviceId);
        return;
    }

    const notificationData = {
        // android_channel_id: android_channel_id,
        android_visibility: 1,
        android_sound: sound,
        sound: "sound",
        app_id: appId,
        small_icon: smallIcon,
        contents: { en: messageText },
        headings: { en: title },
        include_player_ids: [deviceId],  // Ensure it's an array
        priority: 10,
        playSound: true,
        big_picture: "https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg",
        large_icon: "https://cdn.pixabay.com/photo/2018/01/21/01/46/architecture-3095716_960_720.jpg",
    };

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${secretKey}`,
    };

    const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
    };

    const req = https.request(options, (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
            responseBody += chunk;
        });

        res.on("end", () => {
            // console.log("Notification Response:", responseBody);
        });
    });

    req.on("error", (error) => {
        console.error("Push Notification Error:", error);
    });

    req.write(JSON.stringify(notificationData));
    req.end();
}



exports.applicationnotifications=function(deviceId, messageText, secretKey, appId, android_sound, smallIcon, title, android_channel_id,big_picture,large_icon ) {
    
    if (!deviceId) {
        console.error("Invalid Device ID:", deviceId);
        return;
    }

    const notificationData = {
        android_channel_id: android_channel_id,
        android_visibility: 1,
        "android_sound": android_sound,
        "sound":android_sound,
        app_id: appId,
        contents: { "en": messageText },
        "headings": {
              "en": title
         },

        small_icon: smallIcon,
         
        include_player_ids: deviceId,  // Ensure it's an array
        priority: 10,
        playSound: true,
        "Sound": true,
        "enableLights": true,
        "badges": true,
        "isAdm": true,
        "isAndroid": true,
        "big_picture": big_picture,
        "isChrome": true,
        "isChromeWeb": true,
        "isFirefox": true,
        "isIos": true,
        "isSafari": true,
        "isWP_WNS": true,
        "large_icon": large_icon,
        "mutable_content": false,
        "small_icon": smallIcon
    };

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${secretKey}`,
    };

    const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
    };

    const req = https.request(options, (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
            responseBody += chunk;
        });

        res.on("end", () => {
            // console.log("Notification Response:", responseBody);
        });
    });

    req.on("error", (error) => {
        console.error("Push Notification Error:", error);
    });

    req.write(JSON.stringify(notificationData));
    req.end();
}



exports.checkingnotification=function(deviceId, messageText, secretKey, appId, android_sound, smallIcon, title, android_channel_id,big_picture,large_icon ) {
    
    if (!deviceId) {
        console.error("Invalid Device ID:", deviceId);
        return;
    }

    const notificationData = {
        android_channel_id: android_channel_id,
        android_visibility: 1,
        "android_sound": android_sound,
        "sound":android_sound,
        app_id: appId,
        contents: { "en": messageText },
        "headings": {
              "en": title
         },

        small_icon: smallIcon,
         
        include_player_ids: deviceId,  // Ensure it's an array
        priority: 10,
        playSound: true,
        "Sound": true,
        "enableLights": true,
        "badges": true,
        "isAdm": true,
        "isAndroid": true,
        "big_picture": big_picture,
        "isChrome": true,
        "isChromeWeb": true,
        "isFirefox": true,
        "isIos": true,
        "isSafari": true,
        "isWP_WNS": true,
        "large_icon": large_icon,
        "mutable_content": false,
        "small_icon": smallIcon
    };

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${secretKey}`,
    };

    const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
    };

    const req = https.request(options, (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
            responseBody += chunk;
        });

        res.on("end", () => {
            // console.log("Notification Response:", responseBody);
        });
    });

    req.on("error", (error) => {
        console.error("Push Notification Error:", error);
    });

    req.write(JSON.stringify(notificationData));
    req.end();
}





