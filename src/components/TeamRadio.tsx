import React, { useEffect, useRef, useState } from 'react'
import { AssemblyAI } from 'assemblyai';

const TeamRadio = ({ url, driverInfo }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [transcriptText, setTranscriptText] = useState('');
    const [mounted, setMounted] = useState<boolean>(false); //find a better way to understand if it's first mount

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                const percentage = (currentTime / duration) * 100;
                setProgress(percentage);
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', updateProgress);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', updateProgress);
            }
        };

    }, []);

    useEffect(() => {
        if(!import.meta.env.VITE_ASSEMBLY_API_KEY) return

        const client = new AssemblyAI({
            apiKey: import.meta.env.VITE_ASSEMBLY_API_KEY
        })

        const run = async () => {
            console.log("attemping", url);

            const transcript = await client.transcripts.transcribe( {audio_url: url })
            console.log(transcript);

            if (transcript.text)
                setTranscriptText(transcript.text)
        }

        try {
            if (!mounted) run()
            setMounted(true)
        } catch (error) {
            console.log("err");
            setMounted(true)

        }

    }, [])

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (e.target.valueAsNumber / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(e.target.valueAsNumber);
        }
    };

    return (
        <div className='flex items-center mb-4 w-full '>
            <div className="audio-player ">
                <div className='w-14 text-white p-2 text-center font-bold rounded-lg mr-2' style={{ backgroundColor: `#${driverInfo.TeamColour}` }}>{driverInfo.Tla}</div>
                <button onClick={togglePlayPause} className="play-pause-button">
                    {isPlaying ? '❚❚' : '►'}
                </button>
                <input
                    type="range"
                    className="progress-bar"
                    value={progress}
                    onChange={handleProgressChange}
                    style={{ '--progress-percentage': `${progress}%` } as React.CSSProperties}
                />
                <audio ref={audioRef} src={url} />
                <div className='ml-3 w-1/2 text-white'>{transcriptText}</div>
            </div>
        </div>
    );
}

export default TeamRadio