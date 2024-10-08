async function createMeeting({token, topic, start_time,type,duration,timezone="UTC",agenda}:{token: string, topic: string, start_time :string, type: number, duration: number, timezone : string , agenda: string}){
    try{
        
        const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        body:JSON.stringify({
            topic,
            type,
            start_time,
            duration,
            timezone,
            agenda,
            settings:{
                host_video:true,
                participant_video:true,
                join_before_host:false,
                mute_upon_entry:true,
                watermark:false,
                use_pmi:false,
                approval_type:0,
                audio:'both',
                auto_recording:'none'
            }
        }),
        
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })     
        
        const body = await  response.json();

        return body;
    }catch(error){
        console.error('Error',error);
    }
}
