"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function createMeeting(_a) {
    return __awaiter(this, arguments, void 0, function* ({ token, topic, start_time, type, duration, timezone = "UTC", agenda }) {
        try {
            const response = yield fetch('https://api.zoom.us/v2/users/me/meetings', {
                body: JSON.stringify({
                    topic,
                    type,
                    start_time,
                    duration,
                    timezone,
                    agenda,
                    settings: {
                        host_video: true,
                        participant_video: true,
                        join_before_host: false,
                        mute_upon_entry: true,
                        watermark: false,
                        use_pmi: false,
                        approval_type: 0,
                        audio: 'both',
                        auto_recording: 'none'
                    }
                }),
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const body = yield response.json();
            return body;
        }
        catch (error) {
            console.error('Error', error);
        }
    });
}
