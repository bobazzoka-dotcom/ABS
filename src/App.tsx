import { useState, useEffect, ReactNode, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Search, 
  Bell, 
  Mic, 
  User, 
  Home, 
  Compass, 
  Users, 
  Mic2, 
  MoreHorizontal, 
  X, 
  Share2, 
  Heart, 
  Crown, 
  Car, 
  Plane,
  TrendingUp,
  MapPin,
  Flame,
  Settings,
  Edit3,
  Maximize,
  Copy,
  ChevronRight,
  Ghost,
  Medal,
  Backpack,
  Shield,
  Gamepad2,
  QrCode,
  Calendar,
  Camera,
  RefreshCcw,
  Layout,
  Plus,
  Volume2,
  Smile,
  ChevronLeft,
  MessageSquare,
  Lock,
  Eye,
  Send,
  MessageCircle,
  MoreVertical,
  Menu,
  CircleAlert,
  Trophy,
  History,
  Gift as GiftIcon,
  UserPlus
} from 'lucide-react';
import { ROOMS, GIFTS, Room, Gift, Chat, Message, MOCK_CHATS, Seat, RoomMessage, DetailedProfile } from './types';
import bannerImg from './assets/images/dngr_life_banner_1779121577133.png';

function cleanBadWords(text: string): string {
  if (!text) return text;
  const badPatterns = [
    /كسمك/gi,
    /ي\s*متناك/gi,
    /يا\s*متناك/gi,
    /متناك/gi,
    /ي\s*قحبه/gi,
    /يا\s*قحبه/gi,
    /يا\s*قحبة/gi,
    /ي\s*قحبة/gi,
    /قحبه/gi,
    /قحبة/gi,
    /ي\s*شرموطه/gi,
    /يا\s*شرموطه/gi,
    /يا\s*شرموطة/gi,
    /ي\s*شرموطة/gi,
    /شرموطه/gi,
    /شرموطة/gi,
    /ي\s*ديوث/gi,
    /يا\s*ديوث/gi,
    /ديوث/gi,
    /ي\s*منيوك/gi,
    /يا\s*منيوك/gi,
    /منيوك/gi,
    /يا\s*عرص/gi,
    /ياعرص/gi,
    /عرص/gi,
    /يا\s*كلب/gi,
    /ياكلب/gi,
    /كلب/gi,
  ];

  let cleaned = text;
  badPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '***');
  });
  return cleaned;
}

export default function App() {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('user_coins');
    return saved ? parseInt(saved, 10) : 50000;
  });
  const [level, setLevel] = useState(350);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('user_name') || 'الايدارة';
  });
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('user_avatar') || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop';
  });

  useEffect(() => {
    localStorage.setItem('user_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('user_avatar', userAvatar);
  }, [userAvatar]);
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('user_created_rooms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return [...parsed, ...ROOMS];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return ROOMS;
  });
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('حياكم الله في غرفتي الراقية ✨');
  const [newRoomCover, setNewRoomCover] = useState('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600');
  const [newRoomLocation, setNewRoomLocation] = useState('مصر');
  const [newRoomCategory, setNewRoomCategory] = useState('صوتية');

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [minimizedRoom, setMinimizedRoom] = useState<Room | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeGift, setActiveGift] = useState<string | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'social' | 'play' | 'voice' | 'me'>('home');
  const [showRecharge, setShowRecharge] = useState(false);
  const [activeCategory, setActiveCategory] = useState('صوتية');
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showVeggieGame, setShowVeggieGame] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [roomTheme, setRoomTheme] = useState<'purple' | 'royal' | 'space'>('purple');
  const [micFilter, setMicFilter] = useState<'normal' | 'echo' | 'robot' | 'radio'>('normal');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; char: string; x: number; sender: string }[]>([]);
  const roomChatContainerRef = useRef<HTMLDivElement>(null);
  const speakingStatusRef = useRef<Record<string, boolean>>({});
  const [showLuckyWheel, setShowLuckyWheel] = useState(false);
  const [luckyWheelSpinning, setLuckyWheelSpinning] = useState(false);
  const [luckyWheelResult, setLuckyWheelResult] = useState<string | null>(null);
  const [luckyWheelRotation, setLuckyWheelRotation] = useState(0);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [activeProfile, setActiveProfile] = useState<DetailedProfile | null>(null);

  const [showRoomMenu, setShowRoomMenu] = useState(false);
  const [roomMusicPlaying, setRoomMusicPlaying] = useState(false);
  const [roomMusicName, setRoomMusicName] = useState('');
  
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicCtxRef = useRef<AudioContext | null>(null);
  const musicProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const musicSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const musicFileInputRef = useRef<HTMLInputElement>(null);

  const handleMusicFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRoomMusicName(file.name);
    setRoomMusicPlaying(true);
    setShowRoomMenu(false);

    // Stop existing music components if any
    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
    }
    if (musicProcessorRef.current) {
      try { musicProcessorRef.current.disconnect(); } catch (e) {}
    }
    if (musicSourceRef.current) {
      try { musicSourceRef.current.disconnect(); } catch (e) {}
    }
    if (musicCtxRef.current) {
      try { musicCtxRef.current.close(); } catch (e) {}
    }

    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);
    audio.loop = true;
    musicAudioRef.current = audio;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    musicCtxRef.current = audioCtx;

    // Use a ScriptProcessorNode on the audio element to capture pcm blocks and broadcast!
    const source = audioCtx.createMediaElementSource(audio);
    musicSourceRef.current = source;

    const processor = audioCtx.createScriptProcessor(2048, 1, 1);
    musicProcessorRef.current = processor;

    const channel = new BroadcastChannel('kino-vocals-channel');

    processor.onaudioprocess = (evt) => {
      const inputData = evt.inputBuffer.getChannelData(0);

      // Mix and broadcast if sound exists
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      const volumePercent = Math.min(100, Math.round(rms * 400));

      if (volumePercent > 0.5) {
        channel.postMessage({
          userName: `${userName} (موسيقى)`,
          audioData: Array.from(inputData),
          volume: volumePercent
        });
      }
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);
    source.connect(audioCtx.destination); // For local playback so current user can hear too!

    audio.play().catch(err => console.error("Error playing music:", err));
  };

  const handleToggleRoomMusicState = () => {
    if (!musicAudioRef.current) return;
    if (roomMusicPlaying) {
      musicAudioRef.current.pause();
      setRoomMusicPlaying(false);
    } else {
      musicAudioRef.current.play().catch(err => console.error(err));
      setRoomMusicPlaying(true);
    }
    setShowRoomMenu(false);
  };

  // Stop music when leaving the room
  useEffect(() => {
    if (!selectedRoom) {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
      }
      if (musicProcessorRef.current) {
        try { musicProcessorRef.current.disconnect(); } catch (e) {}
      }
      if (musicSourceRef.current) {
        try { musicSourceRef.current.disconnect(); } catch (e) {}
      }
      if (musicCtxRef.current) {
        try { musicCtxRef.current.close(); } catch (e) {}
      }
      setRoomMusicPlaying(false);
      setRoomMusicName('');
    }
  }, [selectedRoom]);

  const openUserProfile = (userData: any) => {
    setActiveProfile({
      name: userData.name || 'مستخدم',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop',
      id: 'ID: 1134957220',
      level: userData.level || 40,
      broadcasterLevel: 13,
      country: 'المغرب',
      countryFlag: '🇲🇦',
      gender: 'female',
      age: 22,
      medalsCount: 5,
      followers: '1.2K',
      following: '450',
      signature: 'غامضون'
    });
  };
  
  // Social/Chat State
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  
  // Voice Room Seat & Chat State
  const [roomSeats, setRoomSeats] = useState<Seat[]>([
    { id: 2, status: 'open' },
    { id: 3, status: 'open' },
    { id: 4, status: 'open' },
    { id: 5, status: 'open' },
    { id: 6, status: 'locked' },
    { id: 7, status: 'locked' },
    { id: 8, status: 'locked' },
    { id: 9, status: 'locked' },
  ]);
  const [roomMessages, setRoomMessages] = useState<RoomMessage[]>([]);
  const [newRoomMessage, setNewRoomMessage] = useState('');
  const [mySeat, setMySeat] = useState(-1);

  const handleSeatAction = (index: number) => {
    const seat = roomSeats[index];
    
    if (seat.status === 'occupied') {
      openUserProfile(seat.user);
      return;
    }

    if (seat.status === 'locked') {
      // For now, any click unlocks (assuming admin for prototype)
      const newSeats = [...roomSeats];
      newSeats[index] = { ...seat, status: 'open' };
      setRoomSeats(newSeats);
      return;
    }

    if (seat.status === 'open') {
      const newSeats = [...roomSeats];
      // If was in a seat, clear it
      if (mySeat !== -1) {
        const oldIndex = roomSeats.findIndex(s => s.id === mySeat);
        if (oldIndex !== -1) {
          newSeats[oldIndex] = { ...newSeats[oldIndex], status: 'open', user: undefined };
        }
      }
      
      // Move to new seat
      newSeats[index] = { 
        ...seat, 
        status: 'occupied', 
        user: { name: userName, avatar: userAvatar } 
      };
      setRoomSeats(newSeats);
      setMySeat(seat.id);
      return;
    }

    if (seat.status === 'occupied' && seat.user?.name === userName) {
      // Leave seat
      const newSeats = [...roomSeats];
      newSeats[index] = { ...seat, status: 'open', user: undefined };
      setRoomSeats(newSeats);
      setMySeat(-1);
    } else if (seat.status === 'occupied') {
      // Lock seat (assuming admin)
      const newSeats = [...roomSeats];
      newSeats[index] = { ...seat, status: 'locked', user: undefined };
      setRoomSeats(newSeats);
    }
  };

  const handleSendRoomChat = () => {
    if (!newRoomMessage.trim()) return;
    const cleanedText = cleanBadWords(newRoomMessage);
    const msg: RoomMessage = {
      id: (Date.now() + Math.random()).toString(),
      userName: userName,
      text: cleanedText,
      type: 'chat'
    };
    setRoomMessages(prev => [...prev, msg].slice(-50)); // Keep last 50
    setNewRoomMessage('');

    // Broadcast message to other tabs
    try {
      const channel = new BroadcastChannel('kino-vocals-channel');
      channel.postMessage({ type: 'chat-msg', msg });
      channel.close();
    } catch (e) {
      console.error("Error broadcasting message:", e);
    }
  };

  useEffect(() => {
    if (selectedRoom && roomChatContainerRef.current) {
      const el = roomChatContainerRef.current;
      // Scroll to bottom immediately
      el.scrollTop = el.scrollHeight;
      // Also schedule a secondary scroll to cover any layout/reconciliation delay
      const t = setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 30);
      return () => clearTimeout(t);
    }
  }, [roomMessages, selectedRoom]);

  // Clean up floating emojis after 4.5s to keep layout DOM extremely fast and light
  useEffect(() => {
    if (floatingEmojis.length > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        setFloatingEmojis(prev => prev.filter(emoji => {
          const timestamp = parseFloat(emoji.id);
          return isNaN(timestamp) || (now - timestamp) < 4500;
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [floatingEmojis]);

  const playSynthesizedSound = (effect: string) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (effect === 'clap') {
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (effect === 'laugh') {
        for (let j = 0; j < 4; j++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(350 + j * 50, ctx.currentTime + j * 0.15);
          osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + j * 0.15 + 0.12);
          
          gain.gain.setValueAtTime(0.15, ctx.currentTime + j * 0.15);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + j * 0.15 + 0.12);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + j * 0.15);
          osc.stop(ctx.currentTime + j * 0.15 + 0.15);
        }
      } else if (effect === 'fire') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(70, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (effect === 'party') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
        });
      }
    } catch (e) {
      console.error("Synthesizer error:", e);
    }
  };

  const [activeSpeakers, setActiveSpeakers] = useState<Record<string, number>>({});

  // Web Audio Contexts and Broadcast Channel for REAL audio transmission between tabs
  useEffect(() => {
    const channel = new BroadcastChannel('kino-vocals-channel');
    let playbackCtx: AudioContext | null = null;
    let timers: Record<string, NodeJS.Timeout> = {};

    channel.onmessage = (event) => {
      if (event.data?.type === 'chat-msg') {
        const { msg } = event.data;
        if (msg.userName === userName) return; // Prevent duplicating own messages which are already added locally
        setRoomMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev; // Avoid duplicate messages
          return [...prev, msg].slice(-50);
        });
        return;
      }
      if (event.data?.type === 'sound-fx') {
        const { effect, userName: sender } = event.data;
        playSynthesizedSound(effect);
        const chars: Record<string, string> = { clap: '👏', laugh: '😂', fire: '🔥', party: '🎉' };
        setFloatingEmojis(prev => [
          ...prev, 
          { id: (Date.now() + Math.random()).toString(), char: chars[effect] || '✨', x: Math.random() * 80 + 10, sender: sender }
        ].slice(-30));
        return;
      }
      if (event.data?.type === 'theme-change') {
        const { theme } = event.data;
        setRoomTheme(theme);
        return;
      }

      const { userName: senderName, audioData, volume } = event.data;
      if (!audioData) return;
      if (senderName === userName) return; // don't echo back to sender

      // Visual indicator for speaker using render-gated transitions (only re-render when speaking state actually changes!)
      const isSpeaking = volume > 2;
      const currentStatus = !!speakingStatusRef.current[senderName];
      if (currentStatus !== isSpeaking) {
        speakingStatusRef.current[senderName] = isSpeaking;
        setActiveSpeakers(prev => {
          const next = { ...prev };
          if (isSpeaking) {
            next[senderName] = volume;
          } else {
            delete next[senderName];
          }
          return next;
        });
      }

      if (timers[senderName]) clearTimeout(timers[senderName]);
      timers[senderName] = setTimeout(() => {
        if (speakingStatusRef.current[senderName]) {
          speakingStatusRef.current[senderName] = false;
          setActiveSpeakers(prev => {
            const next = { ...prev };
            delete next[senderName];
            return next;
          });
        }
      }, 400);

      // Play the audio chunk!
      try {
        if (!playbackCtx) {
          playbackCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (playbackCtx.state === 'suspended') {
          playbackCtx.resume();
        }
        
        const floatData = new Float32Array(audioData);
        const buffer = playbackCtx.createBuffer(1, floatData.length, playbackCtx.sampleRate || 44100);
        buffer.getChannelData(0).set(floatData);

        const sourceNode = playbackCtx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.connect(playbackCtx.destination);
        sourceNode.start();
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    };

    return () => {
      channel.close();
      Object.values(timers).forEach(clearTimeout);
      if (playbackCtx) {
        playbackCtx.close();
      }
    };
  }, [userName]);

  useEffect(() => {
    let micCtx: AudioContext | null = null;
    let processor: ScriptProcessorNode | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    const channel = new BroadcastChannel('kino-vocals-channel');

    if (selectedRoom && isMicOn) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setAudioStream(stream);
          
          // Setup real Web Audio Analysis and Broadcasting
          micCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          sourceNode = micCtx.createMediaStreamSource(stream);
          
          // ScriptProcessor for processing audio chunks with high compatibility
          processor = micCtx.createScriptProcessor(2048, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Calculate real-time Volume (RMS)
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += inputData[i] * inputData[i];
            }
            const rms = Math.sqrt(sum / inputData.length);
            const volumePercent = Math.min(100, Math.round(rms * 400));
            
            const isSpeaking = volumePercent > 2;
            const currentStatus = !!speakingStatusRef.current[userName];
            
            // Only update local state if the speaking status transitions (saving hundreds of state re-renders!)
            if (currentStatus !== isSpeaking) {
              speakingStatusRef.current[userName] = isSpeaking;
              setActiveSpeakers(prev => {
                const next = { ...prev };
                if (isSpeaking) {
                  next[userName] = volumePercent;
                } else {
                  delete next[userName];
                }
                return next;
              });
            }
            
            if (isSpeaking) {
              // Apply real-time software morphing filters depending on the user's active filter!
              let morphedData = inputData;
              if (micFilter === 'echo') {
                morphedData = new Float32Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  const prevIndex1 = (i - 120 + inputData.length) % inputData.length;
                  const prevIndex2 = (i - 300 + inputData.length) % inputData.length;
                  morphedData[i] = inputData[i] + inputData[prevIndex1] * 0.45 + inputData[prevIndex2] * 0.25;
                }
              } else if (micFilter === 'robot') {
                morphedData = new Float32Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  morphedData[i] = inputData[i] * Math.sin(i * 0.22);
                }
              } else if (micFilter === 'radio') {
                morphedData = new Float32Array(inputData.length);
                let lastSample = 0;
                for (let i = 0; i < inputData.length; i++) {
                  morphedData[i] = (inputData[i] - lastSample) * 1.6;
                  lastSample = inputData[i];
                }
              }

              // Broadcast PCM chunk as normal buffer
              channel.postMessage({
                userName: userName,
                audioData: Array.from(morphedData),
                volume: volumePercent
              });
            }
          };
          
          sourceNode.connect(processor);
          processor.connect(micCtx.destination);
        })
        .catch(err => {
          console.error("Microphone access error:", err);
          setIsMicOn(false);
        });
    } else {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
    }
    
    return () => {
      channel.close();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (processor) {
        processor.disconnect();
      }
      if (sourceNode) {
        sourceNode.disconnect();
      }
      if (micCtx) {
        micCtx.close();
      }
    };
  }, [selectedRoom, isMicOn, userName, micFilter]);

  const handleSendGift = (gift: Gift) => {
    if (coins >= gift.price) {
      setCoins(prev => prev - gift.price);
      // Level up logic: each single gift sent increases the level by exactly 1 level!
      setLevel(prev => prev + 1);
      setActiveGift(`أرسلت ${gift.name} بقيمة ${gift.price}! ${gift.icon}`);
      setShowGifts(false);
      setTimeout(() => setActiveGift(null), 3000);
    } else {
      setShowGifts(false);
      setShowRecharge(true);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden bg-[#1D0335] text-white selection:bg-[#D4AF37]/30" dir="rtl">
      {/* Subtle global backing gradients */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#6A1B9A]/15 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-[#2D0B4B]/25 rounded-full blur-[90px] pointer-events-none"></div>
      
      {/* Dynamic Content based on tab */}
      <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar relative">
        {currentTab === 'home' && (
          <div className="relative min-h-screen">
            {/* App Bar for Home - Custom stylized royal header matching the image */}
            <header className="px-4 pt-6 pb-4 bg-[#1D0335]/95 sticky top-0 z-50 border-b border-[#D4AF37]/10 backdrop-blur-md transition-all">
              <div className="relative z-10 flex items-center justify-between">
                
                {/* Search icon on the Left */}
                <button className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/30 p-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center shadow-md">
                  <Search size={20} className="stroke-[2.5]" />
                </button>

                {/* Categories in the Center */}
                <div className="flex gap-4 items-center">
                  {['متابعة', 'صوتية'].map((tab) => {
                    const isActive = activeCategory === tab;
                    if (tab === 'صوتية') {
                      return (
                        <button 
                          key={tab}
                          onClick={() => setActiveCategory(tab)}
                          className={`transition-all duration-300 relative text-sm font-black tracking-wider cursor-pointer ${
                            isActive 
                              ? 'border-2 border-double border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/25 to-[#D4AF37]/5 text-white px-5 py-1.5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                              : 'text-white/60 px-4 py-1.5 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    } else {
                      return (
                        <button 
                          key={tab}
                          onClick={() => setActiveCategory(tab)}
                          className={`text-sm font-black transition-all duration-300 cursor-pointer ${
                            isActive ? 'text-[#D4AF37]' : 'text-[#D4AF37]/65 hover:text-[#D4AF37]'
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    }
                  })}
                </div>

                {/* Premium Icons on the Right */}
                <div className="flex items-center gap-2">
                  <button className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/30 p-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center shadow-md">
                    <Crown size={20} className="stroke-[2.5]" />
                  </button>
                  <button 
                    onClick={() => {
                      setNewRoomTitle(`غرفة ${userName} الراقية 👑`);
                      setShowCreateRoomModal(true);
                    }}
                    className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/30 p-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center shadow-md"
                  >
                    <Plus size={20} className="stroke-[2.5]" />
                  </button>
                </div>

              </div>
            </header>

            {/* Banner - Precise Kingo Live luxury styling */}
            <div className="p-4 pt-4">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative h-44 rounded-[28px] overflow-hidden shadow-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#4A148C] to-[#1D0335]"
              >
                <img 
                  src={bannerImg} 
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-65"
                  alt="Kino Life Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D0335] via-transparent to-transparent"></div>
                
                {/* Decorative Pattern / Text Overlays */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-right">
                  <div className="relative">
                    <h2 className="text-3xl font-black text-[#D4AF37] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight tracking-tight">
                      كينو للغرف الصوتية
                    </h2>
                    {/* Glowing effect */}
                    <span className="absolute -inset-1 bg-[#D4AF37]/10 blur-[10px] rounded-full pointer-events-none"></span>
                  </div>
                  <h3 className="text-lg font-black text-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mt-0.5">
                    عالم الصوت والترفيه الملكي
                  </h3>
                  <p className="text-[11px] text-white/95 font-bold mt-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-[2px] border border-white/10">
                    عالم من الترفيه بلمسة ملكية
                  </p>
                </div>

                {/* Floating ornaments in 3D render look */}
                <div className="absolute top-4 left-6 text-2xl animate-bounce" style={{ animationDuration: '3s' }}>🎁</div>
                <div className="absolute top-8 left-16 text-xl animate-pulse">💖</div>
                <div className="absolute bottom-8 right-6 text-2xl animate-bounce delay-150" style={{ animationDuration: '2.5s' }}>💰</div>
                <div className="absolute top-4 right-1/3 text-lg opacity-80 animate-pulse">✨</div>

                {/* Scroll Indicators as shown in image */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                  <div className="w-4 h-1.5 bg-[#D4AF37] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                </div>
              </motion.div>
            </div>

            {/* Room List Grid - Highly customized matching image (thumbnail on left) */}
            <div className="px-4 space-y-3 pb-24">
              {rooms.map((room) => (
                <motion.div 
                  key={room.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRoom(room)}
                  className="bg-[#2D0B4B]/85 backdrop-blur-sm p-3.5 rounded-[26px] flex items-center gap-4 cursor-pointer hover:border-[#D4AF37]/45 transition-all duration-300 border border-[#D4AF37]/20 shadow-xl group"
                >
                  
                  {/* Image on the LEFT (Requested) */}
                  <div className="relative w-24 h-24 shrink-0 rounded-[20px] overflow-hidden border border-[#D4AF37]/30 shadow-lg bg-black/20">
                    <img 
                      src={room.coverImage} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={room.title}
                    />
                    {/* Top corner joining-room arrow indicator */}
                    <div className="absolute top-1.5 left-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-md">
                       <TrendingUp size={10} className="text-[#D4AF37]" style={{ transform: 'scaleX(-1)' }} />
                    </div>
                  </div>

                  {/* Text details on the RIGHT */}
                  <div className="flex-1 flex flex-col justify-between h-24 min-w-0 py-0.5">
                     
                     {/* Streamer details at top */}
                     <div className="flex items-center gap-2 mb-0.5">
                       <div className="relative">
                         <img src={room.admin.avatar} className="w-5 h-5 rounded-full border border-[#D4AF37] object-cover" />
                         <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-[#1A052D]"></div>
                       </div>
                       <span className="text-[11px] font-black text-[#D4AF37] truncate leading-none">{room.admin.name}</span>
                       <span className="text-xs">🔥</span>
                     </div>

                     {/* Main Room Title */}
                     <h3 className="font-extrabold text-[#FFFFFF] text-sm truncate tracking-tight mb-1 group-hover:text-[#D4AF37] transition-colors">
                       {room.title}
                     </h3>

                     {/* Room Subtitle/Description */}
                     <p className="text-[11px] text-[#C1AFD6] font-semibold opacity-95 truncate mb-1">
                       {room.id === '1' ? 'حياكم جميعا في أقوى روم بث مباشر' : room.description}
                     </p>
                     
                     {/* Footer stats line */}
                     <div className="flex items-center gap-3 mt-1">
                        {/* Users Visitor Pill */}
                        <div className="flex items-center gap-1.5 bg-[#1A052D]/60 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/15 text-[#D4AF37] font-black text-[10px]">
                          <Users size={12} className="text-[#D4AF37]" strokeWidth={2.5} />
                          <span>{room.viewerCount}</span>
                        </div>
                        {/* Little Gift Support Badge */}
                        <div className="bg-[#E51C60]/20 text-[#E51C60] p-1 rounded-lg border border-[#E51C60]/10 hover:animate-bounce">
                           <GiftIcon size={12} className="fill-[#E51C60]/20" />
                        </div>
                     </div>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        )}


        {currentTab === 'me' && (
          <ProfilePage 
            userName={userName} 
            level={Math.floor(level)} 
            userAvatar={userAvatar}
            setUserAvatar={setUserAvatar}
            onShowFull={() => setShowFullProfile(true)} 
            onShowBackpack={() => setShowBackpack(true)} 
            setShowRecharge={setShowRecharge} 
          />
        )}
        
        {/* Full Profile View Modal */}
        <AnimatePresence>
          {showFullProfile && (
            <FullProfileView 
              level={Math.floor(level)} 
              userName={userName}
              setUserName={setUserName}
              userAvatar={userAvatar}
              setUserAvatar={setUserAvatar}
              onClose={() => setShowFullProfile(false)} 
            />
          )}
        </AnimatePresence>

        {/* Veggie Game Modal */}
        <AnimatePresence>
          {showVeggieGame && (
            <VeggieGameModal 
              onClose={() => setShowVeggieGame(false)} 
              coins={coins}
              setCoins={setCoins}
              setShowRecharge={setShowRecharge}
              userAvatar={userAvatar}
            />
          )}
        </AnimatePresence>

        {/* Global Lucky Wheel Modal */}
        <AnimatePresence>
          {showLuckyWheel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
            >
              <div className="bg-[#1C0432] rounded-[40px] w-full max-w-[310px] p-5 border-2 border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.35)] flex flex-col items-center relative text-center">
                <button
                  onClick={() => setShowLuckyWheel(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-colors"
                >
                  ✕
                </button>
                
                <h3 className="text-lg font-black bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent mb-1 tracking-wider">🎡 عجلة الحظ الماسية</h3>
                <p className="text-[10px] text-gray-400 mb-5 font-semibold">استمتع باللف من الكيبورد واربح كوينز مباشرة! الدورة بـ 200 🪙</p>

                {/* Visual Wheel using CSS sector wedges */}
                <div className="relative w-44 h-44 rounded-full border-4 border-yellow-500 shadow-xl overflow-hidden flex items-center justify-center"
                  style={{
                    transform: `rotate(${luckyWheelRotation}deg)`,
                    transition: luckyWheelSpinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.3, 1)' : 'none'
                  }}
                >
                  {[
                    { label: '500 🪙', color: '#7c3aed' },
                    { label: 'لا حظ 🏜️', color: '#1f2937' },
                    { label: '👑 تاج VIP', color: '#d97706' },
                    { label: '100 🪙', color: '#db2777' },
                    { label: '1000 🪙', color: '#059669' },
                    { label: 'خالي 🏜️', color: '#4b5563' },
                    { label: 'صندوق 🎁', color: '#2563eb' },
                    { label: '50 🪙', color: '#dc2626' }
                  ].map((slice, i) => (
                    <div
                      key={i}
                      className="absolute w-22 h-22 origin-bottom-right"
                      style={{
                        top: '0',
                        left: '0',
                        transform: `rotate(${i * 45}deg) skewY(-45deg)`,
                        backgroundColor: slice.color,
                        opacity: 0.95,
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <span className="absolute bottom-2 right-2 text-[8px] font-black text-white text-right rotate-[65deg]"
                        style={{
                          transformOrigin: 'bottom right',
                        }}
                      >
                        {slice.label}
                      </span>
                    </div>
                  ))}
                  <div className="absolute w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-white z-10 shadow-lg flex items-center justify-center font-black text-[9px] text-yellow-950">
                    Keno
                  </div>
                </div>

                {/* Wheel pointer wedge */}
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-yellow-400 drop-shadow-xl z-20 -mt-[1px] mb-4"></div>

                {luckyWheelResult && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-4 bg-yellow-400/10 border border-yellow-400/35 px-4 py-1.5 rounded-2xl flex flex-col items-center shrink-0 w-full"
                  >
                    <span className="text-[#D4AF37] text-[10px] font-extrabold">النتيجة الرسمية 🎉</span>
                    <span className="text-white text-xs font-black mt-0.5">{luckyWheelResult}</span>
                  </motion.div>
                )}

                <button
                  disabled={luckyWheelSpinning}
                  onClick={() => {
                    if (coins < 200) {
                      alert('رصيدك من الكوينز غير كافي للعب! السحبة بـ 200 كوينز');
                      return;
                    }
                    setCoins(prev => prev - 200);
                    setLuckyWheelSpinning(true);
                    setLuckyWheelResult(null);

                    const prizes = [
                      { label: '500 كوينز 🪙', win: 500 },
                      { label: 'حظ سعيد المرة القادمة! 🏜️', win: 0 },
                      { label: 'التاج الملكي الفخري! 👑', win: 2000 },
                      { label: '100 كوينز فائزة 🪙', win: 100 },
                      { label: '1000 كوينز كاش! 🪙', win: 1000 },
                      { label: 'لا يوجد فوز 🏜️', win: 0 },
                      { label: 'صندوق هدايا الحظ المميز! 🎁', win: 500 },
                      { label: '50 كوينز 🪙', win: 50 }
                    ];

                    const winnerIndex = Math.floor(Math.random() * prizes.length);
                    const extraSpins = 6;
                    const itemAngle = winnerIndex * 45;
                    const targetRotation = luckyWheelRotation + (360 * extraSpins) - (itemAngle) - (luckyWheelRotation % 360);
                    setLuckyWheelRotation(targetRotation);

                    setTimeout(() => {
                      const prize = prizes[winnerIndex];
                      setLuckyWheelResult(prize.label);
                      if (prize.win > 0) {
                        setCoins(prev => prev + prize.win);
                      }
                      setLuckyWheelSpinning(false);

                      // Local notice
                      const noticeMsg: RoomMessage = {
                        id: Date.now().toString(),
                        userName: 'عجلة الحظ 🎡',
                        text: `${userName} قام بالسحب وفاز بـ ${prize.label}! 🎉`,
                        type: 'system'
                      };
                      setRoomMessages(prev => [...prev, noticeMsg].slice(-50));
                    }, 4000);
                  }}
                  className={`w-full py-2.5 rounded-2xl text-xs font-black border transition-all active:scale-95 ${
                    luckyWheelSpinning 
                      ? 'bg-purple-950/30 border-purple-900/40 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 border-yellow-300 text-yellow-900 shadow-lg hover:brightness-105 shadow-yellow-500/10'
                  }`}
                >
                  {luckyWheelSpinning ? 'جاري تدوير العجلة...' : 'البدء بـ (200 🪙)'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backpack View Modal */}
        <AnimatePresence>
          {showBackpack && (
            <BackpackView 
              onClose={() => setShowBackpack(false)} 
            />
          )}
        </AnimatePresence>

        {/* Create Room Modal */}
        <AnimatePresence>
          {showCreateRoomModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex flex-col justify-end sm:justify-center p-4"
              dir="rtl"
            >
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-gradient-to-b from-[#351159] to-[#150226] border-t-2 sm:border-2 border-[#D4AF37]/45 rounded-t-[36px] sm:rounded-[36px] p-6 w-full max-w-md mx-auto relative shadow-[0_0_50px_rgba(212,175,55,0.25)] text-right pb-10"
              >
                {/* Visual Decorative Icon */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#D4AF37] via-amber-500 to-yellow-600 w-20 h-20 rounded-full border-4 border-[#1c0432] flex items-center justify-center shadow-2xl z-10">
                  <span className="text-3xl">🎙️</span>
                </div>

                <button
                  onClick={() => setShowCreateRoomModal(false)}
                  className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-white/70 w-8 h-8 rounded-full flex items-center justify-center transition-colors font-black text-sm z-20"
                >
                  ✕
                </button>

                <div className="text-center mt-10 mb-6">
                  <h3 className="text-xl font-bold text-[#D4AF37] tracking-wider">إنشاء غرفتك الصوتية الراقية</h3>
                  <p className="text-[10px] text-white/60 mt-1">ابدأ غرفتك الخاصة الآن، وشارك اللحظات السعيدة مع الأصدقاء!</p>
                </div>

                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-1 mr-1">عنوان الغرفة</label>
                    <input
                      type="text"
                      value={newRoomTitle}
                      onChange={(e) => setNewRoomTitle(e.target.value)}
                      placeholder={`مثل: روم ${userName} الملكي`}
                      className="w-full bg-[#1b052c] text-white border border-[#D4AF37]/20 focus:border-[#D4AF37]/65 focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-xs font-semibold outline-none transition-all placeholder-white/30 text-right"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-1 mr-1">وصف أو موضوع الغرفة</label>
                    <input
                      type="text"
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                      placeholder="اكتب شيئاً ترحيبياً لزوارك..."
                      className="w-full bg-[#1b052c] text-white border border-[#D4AF37]/20 focus:border-[#D4AF37]/65 rounded-xl px-4 py-3 text-xs font-semibold outline-none transition-all placeholder-white/30 text-right"
                    />
                  </div>

                  {/* Location & Category Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-1 mr-1">الموقع/الدولة</label>
                      <select
                        value={newRoomLocation}
                        onChange={(e) => setNewRoomLocation(e.target.value)}
                        className="w-full bg-[#1b052c] text-white border border-[#D4AF37]/20 focus:border-[#D4AF37]/50 rounded-xl px-4 py-3 text-xs outline-none cursor-pointer"
                      >
                        <option value="مصر">🇪🇬 مصر</option>
                        <option value="السعودية">🇸🇦 السعودية</option>
                        <option value="الإمارات">🇦🇪 الإمارات</option>
                        <option value="الكويت">🇰🇼 الكويت</option>
                        <option value="العراق">🇮🇶 العراق</option>
                        <option value="المغرب">🇲🇦 المغرب</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-1 mr-1">التصنيف</label>
                      <select
                        value={newRoomCategory}
                        onChange={(e) => setNewRoomCategory(e.target.value)}
                        className="w-full bg-[#1b052c] text-white border border-[#D4AF37]/20 focus:border-[#D4AF37]/50 rounded-xl px-4 py-3 text-xs outline-none cursor-pointer"
                      >
                        <option value="صوتية">🎙️ بث صوتي</option>
                        <option value="ألعاب">🎮 ألعاب وتسلية</option>
                        <option value="دردشة">💬 دردشة عامة</option>
                        <option value="طرب">🎤 طرب وموسيقى</option>
                      </select>
                    </div>
                  </div>

                  {/* Cover Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-1 mr-1">
                      <label className="block text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">صورة غلاف الغرفة</label>
                      
                      {/* Hidden manual selector link button */}
                      <label className="text-[10px] font-bold text-pink-400 cursor-pointer hover:underline flex items-center gap-1">
                        <Camera size={12} />
                        رفع صورة مخصصة 🖼_
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setNewRoomCover(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Previews & preset picker */}
                    <div className="flex flex-col gap-3">
                      {/* Active Preview */}
                      <div className="relative h-24 rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-inner bg-black/40 flex items-center justify-center">
                        <img src={newRoomCover} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview cover" />
                        <span className="relative text-[10px] font-black px-3 py-1 bg-black/60 rounded-full border border-white/10 text-yellow-300">الغلاف الحالي المختار ✨</span>
                      </div>

                      {/* Presets Row */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: '🎷 كلاسيك', url: 'https://images.unsplash.com/photo-159848035139-bdbb2231ce04?q=80&w=300' },
                          { name: '☕ شباب', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300' },
                          { name: '👑 ملكي', url: 'https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?q=80&w=300' },
                          { name: '🎮 ألعاب', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300' }
                        ].map((preset) => (
                          <button
                            type="button"
                            key={preset.name}
                            onClick={() => setNewRoomCover(preset.url)}
                            className={`relative h-14 rounded-xl overflow-hidden border transition-all ${newRoomCover === preset.url ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-95 shadow-lg' : 'border-white/10 hover:border-white/20'}`}
                          >
                            <img src={preset.url} className="w-full h-full object-cover" alt={preset.name} />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white/90 font-bold py-0.5 text-center leading-none truncate">
                              {preset.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submitting Start Live Stream Button */}
                <button
                  type="button"
                  onClick={() => {
                    const finalTitle = newRoomTitle.trim() || `غرفة ${userName} الراقية 👑`;
                    const newRoom: Room = {
                      id: Date.now().toString(),
                      title: finalTitle,
                      description: newRoomDescription.trim() || 'حياكم في غرفتي الراقية ✨',
                      viewerCount: '1',
                      location: newRoomLocation,
                      coverImage: newRoomCover,
                      admin: {
                        name: userName,
                        avatar: userAvatar,
                        level: 100 // Starting high!
                      }
                    };
                    
                    // Add new room
                    setRooms(prev => [newRoom, ...prev]);

                    // Save custom rooms to localStorage
                    try {
                      const saved = localStorage.getItem('user_created_rooms');
                      let cur: Room[] = [];
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        if (Array.isArray(parsed)) cur = parsed;
                      }
                      localStorage.setItem('user_created_rooms', JSON.stringify([newRoom, ...cur]));
                    } catch (e) {
                      console.error(e);
                    }

                    // Open room
                    setSelectedRoom(newRoom);
                    setShowCreateRoomModal(false);
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-purple-950 font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-xs shadow-lg shadow-yellow-500/25 border-t border-white/25"
                >
                  🚀 إطلاق وبدء الغرفة الصوتية الآن
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {currentTab === 'play' && (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0F0C29] via-[#302B63] to-[#24243E]" dir="rtl">
            <header className="p-6">
              <h2 className="text-2xl font-black text-white tracking-widest text-center">ردهة الألعاب</h2>
            </header>

            <div className="flex-1 p-6 flex flex-col overflow-y-auto no-scrollbar pb-24">
              <div 
                onClick={() => setShowRecharge(true)}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-amber-500/50 flex items-center justify-between shadow-2xl relative overflow-hidden group mb-8 cursor-pointer active:scale-95 transition-transform"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                 <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-white/60 text-xs font-black">رصيدك الحالي:</span>
                    <span className="text-white text-3xl font-black tracking-tighter drop-shadow-md">{coins.toLocaleString()}</span>
                 </div>
                 <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/40 animate-pulse relative z-10">
                    <Coins size={32} className="text-amber-900" />
                 </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-2 gap-6 pb-12">
                <GameCard 
                  title="Lucky Cat" 
                  icon={<div className="text-5xl drop-shadow-[0_0_10px_rgba(255,100,100,0.4)]">🐱</div>} 
                  color="bg-gradient-to-br from-indigo-600 to-purple-800" 
                  onClick={() => setShowVeggieGame(true)} 
                />
                <GameCard 
                  title="عجلة المراهنة" 
                  icon={<Gamepad2 size={40} />} 
                  color="bg-rose-500" 
                  onClick={() => setShowLuckyWheel(true)} 
                />
                <GameCard 
                  title="صندوق الحظ" 
                  icon={<GiftIcon size={40} />} 
                  color="bg-orange-500" 
                  onClick={() => {
                    // Quick lucky box surprise reward
                    if (coins < 50) {
                      alert('رصيدك من الكوينز غير كافي لفتح صندوق الحظ! التكلفة: 50 كوينز');
                      return;
                    }
                    setCoins(prev => prev - 50);
                    const rewards = [20, 40, 60, 80, 100, 150, 200];
                    const choice = rewards[Math.floor(Math.random() * rewards.length)];
                    setCoins(prev => prev + choice);
                    alert(`لقد فتحت صندوق الحظ وحصلت على: ${choice} كوينز! 🎁✨`);
                  }} 
                />
                <GameCard 
                  title="سباق السيارات" 
                  icon={<div className="text-5xl">🏎️</div>} 
                  color="bg-sky-500" 
                  onClick={() => {
                    // Simple prediction race
                    if (coins < 100) {
                      alert('رصيدك من الكوينز غير كافي لدخول السباق! التكلفة: 100 كوينز');
                      return;
                    }
                    setCoins(prev => prev - 100);
                    const cars = ['السيارة الحمراء 🔴', 'السيارة الصفراء 🟡', 'السيارة الزرقاء 🔵'];
                    const winner = cars[Math.floor(Math.random() * cars.length)];
                    const select = prompt('اختر سيارتك لتشجيعها:\n1- الحمراء 🔴\n2- الصفراء 🟡\n3- الزرقاء 🔵', '1');
                    if (!select) {
                      setCoins(prev => prev + 100); // return coins if cancelled
                      return;
                    }
                    let chosen = '';
                    if (select === '1') chosen = 'الحمراء 🔴';
                    else if (select === '2') chosen = 'الصفراء 🟡';
                    else chosen = 'الزرقاء 🔵';

                    const won = winner.includes(chosen);
                    if (won) {
                      setCoins(prev => prev + 300);
                      alert(`🏁 انتهى السباق بفوز ${winner}!\n🎉 أحسنت التوقع! لقد فزت بـ 300 كوينز!`);
                    } else {
                      alert(`🏁 انتهى السباق بفوز ${winner}!\n🏜️ للأسف خسرت التحدي هذه المرة. حظ سعيد المرة القادمة!`);
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        )}
        
        {currentTab === 'social' && (
          <SocialPage 
            chats={chats} 
            onOpenChat={(id) => {
              setActiveChatId(id);
              // Mark as read
              setChats(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
            }} 
          />
        )}
        
        {currentTab === 'voice' && (
          <div className="flex items-center justify-center h-[70vh] text-gray-500 text-sm">
            هذه الصفحة قيد التطوير...
          </div>
        )}
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {activeChatId && (
          <ChatWindow 
            chat={chats.find(c => c.id === activeChatId)!}
            onClose={() => setActiveChatId(null)}
            onSendMessage={(text) => {
              const cleanedText = cleanBadWords(text);
              const now = new Date();
              const timestamp = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
              
              const newMessage: Message = {
                id: Date.now(),
                text: cleanedText,
                sender: 'me',
                timestamp
              };

              setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                  return {
                    ...c,
                    lastMessage: cleanedText,
                    lastTime: timestamp,
                    messages: [...c.messages, newMessage]
                  };
                }
                return c;
              }));

              // Simulate a mock reply
              setTimeout(() => {
                const reply: Message = {
                  id: Date.now() + 1,
                  text: 'شكراً جزيلاً! 😊',
                  sender: 'them',
                  timestamp: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                };
                setChats(prev => prev.map(c => {
                  if (c.id === activeChatId) {
                    return {
                      ...c,
                      lastMessage: reply.text,
                      messages: [...c.messages, reply]
                    };
                  }
                  return c;
                }));
              }, 1500);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gradient-to-t from-[#0A0114] via-[#110121] to-[#20053D] border-t-[1.5px] border-[#D4AF37]/30 shadow-[0_-10px_40px_rgba(212,175,55,0.18)] p-3 pb-6 rounded-t-[38px] flex justify-around items-end z-40">
        <NavItem 
          icon={<Home size={28} className="text-[#D4AF37]" />} 
          label="الرئيسية" 
          active={currentTab === 'home'} 
          onClick={() => setCurrentTab('home')}
        />
        <NavItem 
          icon={<div className="relative">
            <Users size={28} className="text-[#D4AF37]" />
            <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black ring-4 ring-[#110121] shadow-lg">+99</span>
          </div>} 
          label="اجتماعي" 
          active={currentTab === 'social'} 
          onClick={() => setCurrentTab('social')}
        />
        <NavItem 
          icon={<Gamepad2 size={28} className="text-[#D4AF37]" />} 
          label="ترفيه"
          active={currentTab === 'play'}
          onClick={() => setCurrentTab('play')}
        />
        <NavItem 
          icon={<Mic size={28} className="text-[#D4AF37]" />} 
          label="صوتية" 
          active={currentTab === 'voice'} 
          onClick={() => setCurrentTab('voice')}
        />
        <NavItem 
          icon={<div className="relative">
            <User size={28} className="text-[#D4AF37]" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-4 ring-[#110121] shadow-md"></span>
          </div>} 
          label="أنا" 
          active={currentTab === 'me'} 
          onClick={() => setCurrentTab('me')}
        />
      </nav>

      {/* Minimized Room Bar */}
      <AnimatePresence>
        {minimizedRoom && !selectedRoom && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => {
              setSelectedRoom(minimizedRoom);
              setMinimizedRoom(null);
            }}
            className="fixed bottom-24 left-4 right-4 z-[45] bg-pink-500/90 backdrop-blur-xl p-3 rounded-2xl flex items-center justify-between shadow-2xl border border-white/20 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={minimizedRoom.coverImage} className="w-10 h-10 rounded-xl object-cover animate-pulse" />
                <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white ring-2 ring-green-500/30"></div>
              </div>
              <div>
                <h4 className="text-white text-xs font-black truncate max-w-[120px]">{minimizedRoom.title}</h4>
                <div className="flex items-center gap-1">
                  <Mic size={10} className="text-white/60" />
                  <span className="text-[10px] text-white/60">البث شغال...</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimizedRoom(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg text-white"
               >
                 <X size={18} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Room Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col max-w-md mx-auto overflow-hidden shadow-[0_-10px_50px_rgba(0,0,0,0.5)] bg-[#0B0215]"
          >
            {/* Background Image depending on selected roomTheme */}
            <div className="absolute inset-0 z-0">
               <img 
                 src={
                   roomTheme === 'space'
                     ? "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1200&auto=format&fit=crop"
                     : roomTheme === 'royal'
                     ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                     : "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1200&auto=format&fit=crop"
                 } 
                 className="w-full h-full object-cover transition-all duration-1000 filter brightness-[0.4]"
                 alt="Room Background"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-950/25 to-black/80"></div>
            </div>

            {/* Floating Emojis Action Overlay */}
            <div className="absolute inset-x-0 bottom-36 top-0 pointer-events-none z-30 overflow-hidden">
              {floatingEmojis.map(emoji => (
                <motion.div
                  key={emoji.id}
                  initial={{ y: '100%', x: `${emoji.x}%`, opacity: 1, scale: 0.8 }}
                  animate={{ y: '-10%', opacity: 0, scale: 1.4 }}
                  transition={{ duration: 3.5, ease: 'easeOut' }}
                  className="absolute bottom-0 text-3xl flex flex-col items-center select-none"
                >
                  <span className="filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)]">{emoji.char}</span>
                  <span className="bg-black/85 text-[8px] text-[#FC68AA] border border-[#FC68AA]/20 font-black px-1.5 py-0.5 rounded-md mt-0.5 shadow-lg select-none pointer-events-none">
                    {emoji.sender}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Room Header Overlay */}
            <header className="relative z-10 p-3 pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 relative">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setMinimizedRoom(selectedRoom);
                            setSelectedRoom(null);
                          }} 
                          className="p-2 bg-black/40 hover:bg-white/10 rounded-full transition-colors text-white/80 border border-white/5"
                        >
                          <ChevronLeft size={24} className="rotate-90" />
                        </button>
                        
                        <button 
                          onClick={() => setShowRoomMenu(!showRoomMenu)}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all border bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-white/30 text-white shadow-lg active:scale-95"
                          title="خيارات الموسيقى والمزيد"
                        >
                          <MoreVertical size={24} className="text-white filter drop-shadow-md animate-pulse" />
                        </button>
                      </div>

                      {/* Hidden file input for music files */}
                      <input 
                        type="file" 
                        ref={musicFileInputRef} 
                        onChange={handleMusicFileChange} 
                        accept="audio/mp3,audio/mpeg,audio/wav,audio/x-wav,audio/ogg,audio/*"
                        className="hidden" 
                      />

                      {/* Dropdown Menu - Interactive options and room theme switcher */}
                      <AnimatePresence>
                        {showRoomMenu && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute left-0 top-12 w-56 bg-[#170228]/95 backdrop-blur-xl rounded-2xl p-3 border border-pink-500/20 shadow-[0_15px_30px_rgba(0,0,0,0.6)] z-50 flex flex-col gap-2"
                          >
                            <div className="text-[10px] font-black text-[#D4AF37] px-2 pb-1 border-b border-white/5 uppercase tracking-wider text-center">
                              خيارات الغرفة الصوتية
                            </div>
                            
                            <button 
                              onClick={() => {
                                musicFileInputRef.current?.click();
                              }}
                              className="flex items-center justify-start gap-2 w-full text-right px-2 py-1.5 hover:bg-white/5 rounded-xl text-xs font-black text-white transition-colors"
                            >
                              <span className="text-sm">🎵</span>
                              <span>تشغيل موسيقى من جهازك</span>
                            </button>

                            {/* Theme Choice Selectors */}
                            <div className="p-1 px-2 bg-black/30 rounded-xl border border-white/5 flex flex-col gap-1">
                              <span className="text-[8px] font-black text-white/40 text-center">تغيير خلفية الجميع مباشرة 🎨</span>
                              <div className="grid grid-cols-3 gap-1">
                                {[
                                  { t: 'purple', name: 'سديم 🌌' },
                                  { t: 'royal', name: 'ملكي ✨' },
                                  { t: 'space', name: 'كوني 🪐' }
                                ].map(themeOpt => (
                                  <button
                                    key={themeOpt.t}
                                    onClick={() => {
                                      setRoomTheme(themeOpt.t as any);
                                      try {
                                        const ch = new BroadcastChannel('kino-vocals-channel');
                                        ch.postMessage({ type: 'theme-change', theme: themeOpt.t });
                                        ch.close();
                                      } catch (e) {}
                                      setShowRoomMenu(false);
                                    }}
                                    className={`py-1 rounded-md text-[8px] font-black text-center transition-all ${
                                      roomTheme === themeOpt.t 
                                        ? 'bg-[#FC68AA] text-white' 
                                        : 'bg-white/5 text-white/60 hover:text-white'
                                    }`}
                                  >
                                    {themeOpt.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {roomMusicName && (
                              <div className="mt-1 bg-black/30 p-2 rounded-xl flex flex-col gap-1.5 border border-white/5">
                                <div className="text-[9px] text-[#FC68AA] font-black truncate text-center" title={roomMusicName}>
                                  🔈 {roomMusicName}
                                </div>
                                <div className="grid grid-cols-2 gap-1.55">
                                  <button 
                                    onClick={handleToggleRoomMusicState}
                                    className="flex items-center justify-center gap-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black text-white transition-colors"
                                  >
                                    {roomMusicPlaying ? '⏸️ إيقاف' : '▶️ تشغيل'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (musicAudioRef.current) {
                                        musicAudioRef.current.pause();
                                      }
                                      setRoomMusicPlaying(false);
                                      setRoomMusicName('');
                                      setShowRoomMenu(false);
                                    }}
                                    className="flex items-center justify-center gap-1 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-[10px] font-black transition-colors"
                                  >
                                    🛑 إنهاء
                                  </button>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="bg-black/50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/5">
                      <Users size={16} className="text-pink-400" />
                      <span className="text-xs font-black text-white">{selectedRoom.viewerCount}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-black text-white truncate max-w-[150px] drop-shadow-lg">{selectedRoom.title}</h2>
                    {roomMusicPlaying ? (
                      <div className="flex items-center gap-1 mt-0.5 bg-black/50 px-1.5 py-0.5 rounded-full border border-pink-500/30 self-start animate-pulse max-w-[90px]">
                        <span className="text-[7px] text-[#FC68AA] font-black truncate">🎵 {roomMusicName}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/50 font-bold tracking-widest">{new Date().toLocaleDateString('ar-EG')}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedRoom(null)} 
                      className="p-2 bg-red-600/40 hover:bg-red-500/60 rounded-full transition-colors text-white border border-red-500/20"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="bg-teal-500/30 backdrop-blur-md p-1.5 pl-4 rounded-2xl flex items-center gap-3 border border-white/10 shadow-lg">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-white">البث شغال</span>
                      <span className="text-[8px] text-teal-200/80 font-bold">ID: {selectedRoom.id}8812</span>
                    </div>
                    <div className="relative">
                      <img src={selectedRoom.admin.avatar} className="w-10 h-10 rounded-xl object-cover border-2 border-white/20 shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1438]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </header>


            {/* Main Room Content (Seats) */}
            <main className="relative z-10 flex-1 flex flex-col items-center pt-1 overflow-hidden w-full">
              {/* Admin At Center Top with beautiful crown aura - resized to be exactly small (w-12 h-12) */}
              <div className="flex flex-col items-center gap-1.5 mb-2.5 shrink-0 relative mt-0.5">
                 <div 
                   className="relative group cursor-pointer active:scale-95 transition-transform"
                   onClick={() => openUserProfile(selectedRoom.admin)}
                 >
                    {/* Golden Crown floating over host */}
                    <span className="absolute -top-4.5 left-1/2 -translate-x-1/2 text-sm filter drop-shadow-[0_1px_2px_rgba(212,175,55,0.7)] animate-bounce text-yellow-400 z-20">👑</span>
                    <div className="absolute inset-[-3px] bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 rounded-full animate-spin-slow opacity-80"></div>
                    <img 
                      src={selectedRoom.admin.avatar} 
                      className="w-12 h-12 rounded-full border border-yellow-400 z-10 relative object-cover shadow-[0_0_10px_rgba(251,191,36,0.5)] bg-slate-900" 
                    />
                 </div>
                 <h3 className="text-[10px] font-black flex items-center gap-0.5 text-yellow-400">
                   {selectedRoom.admin.name}
                   <div className="bg-[#D4AF37] text-white rounded-full p-0.5"><Smile size={8} /></div>
                 </h3>
              </div>

              {/* Mic Seats Grid - Luxury Frames & Speaking Halos */}
              <div className="grid grid-cols-4 gap-x-8 gap-y-5 px-6 shrink-0 z-10 pb-1.5">
                {roomSeats.map((seat, index) => {
                  const isSpeaking = seat.status === 'occupied' && seat.user && activeSpeakers[seat.user.name] > 2;
                  
                  // Custom seat styling depending on ID for extremely professional layout
                  const getSeatOverlayFrame = () => {
                    if (seat.id === 2) return 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-[#0B0215] shadow-[0_0_15px_rgba(250,204,21,0.6)]';
                    if (seat.id === 3) return 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-[#0B0215] shadow-[0_0_15px_rgba(34,211,238,0.6)]';
                    if (seat.id === 4 || seat.id === 5) return 'ring-2 ring-pink-500';
                    return 'ring-1 ring-white/20';
                  };

                  const getSeatBadge = () => {
                    if (seat.id === 2) return '⭐ MVP';
                    if (seat.id === 3) return '🛡️ VIP';
                    if (seat.id === 4) return '👑';
                    return null;
                  };

                  return (
                    <div key={seat.id} className="flex flex-col items-center gap-1.5 relative">
                       {/* Speaker Crown or Frame Badge */}
                       {getSeatBadge() && (
                         <span className="absolute -top-3.5 bg-black/80 px-1 border border-pink-400/20 text-[#FC68AA] rounded-md text-[7px] font-black tracking-wide z-20">
                           {getSeatBadge()}
                         </span>
                       )}

                       <div 
                        onClick={() => handleSeatAction(index)}
                        className={`w-12 h-12 rounded-full transition-all active:scale-90 flex items-center justify-center relative ${
                          isSpeaking
                            ? 'ring-4 ring-green-400 animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.8)]'
                            : getSeatOverlayFrame()
                        }`}
                      >
                        {isSpeaking && (
                          <>
                            <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping z-0"></span>
                            {/* Animated sound equalizer bars inside seat frame */}
                            <div className="absolute -bottom-1 inset-x-2 h-2.5 flex justify-around items-end gap-0.5 z-25 bg-black/60 rounded-full px-1 border border-green-400/30">
                              <span className="w-0.5 h-1.5 bg-green-400 rounded-full animate-bounce"></span>
                              <span className="w-0.5 h-2.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                              <span className="w-0.5 h-1 bg-green-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                            </div>
                          </>
                        )}
                        {seat.status === 'occupied' ? (
                          <img src={seat.user?.avatar} className="w-full h-full rounded-full object-cover z-10 border border-white/10" />
                        ) : seat.status === 'locked' ? (
                          <Lock size={16} className="text-white/20 z-10" />
                        ) : (
                          <Plus size={18} className="text-white/30 z-10" />
                        )}
                      </div>
                      <span className={`text-[9px] font-black truncate max-w-[54px] text-center ${isSpeaking ? 'text-green-300 font-extrabold shadow-sm' : seat.status === 'occupied' ? 'text-white/80' : 'text-white/30'}`}>
                        {seat.status === 'occupied' ? seat.user?.name : `مقعد ${seat.id}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Soundboard FX and Voice Changer control board center footer */}
              <div className="w-full px-4 flex flex-col gap-1.5 mt-auto z-10 pb-1.5 bg-gradient-to-t from-black/25 via-transparent to-transparent">
                {/* Voice Changer Selector */}
                <span className="text-[7.5px] font-black text-[#ffffff55] uppercase tracking-widest text-center">المؤثرات الصوتية والفلترة للميكروفون 🎛️</span>
                <div className="flex items-center justify-center gap-1 px-1 shrink-0">
                  {[
                    { type: 'normal', name: '🎙️ طبيعي' },
                    { type: 'echo', name: '🎛️ ميكسر صدى' },
                    { type: 'robot', name: '🤖 صوت آلي' },
                    { type: 'radio', name: '📻 ووش راديو' }
                  ].map(filt => (
                    <button
                      key={filt.type}
                      onClick={() => setMicFilter(filt.type as any)}
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black whitespace-nowrap transition-all border shrink-0 ${
                        micFilter === filt.type 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400/30 shadow-lg shadow-pink-500/20' 
                          : 'bg-black/40 text-white/60 border-white/5 hover:text-white'
                      }`}
                    >
                      {filt.name}
                    </button>
                  ))}
                </div>

                {/* Sound FX trigger panel */}
                <div className="flex items-center justify-around py-1 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 mx-1 mt-0.5">
                  {[
                    { effect: 'clap', icon: '👏', label: 'تصفيق' },
                    { effect: 'laugh', icon: '😂', label: 'ضحك كتم' },
                    { effect: 'fire', icon: '🔥', label: 'دعم ناري' },
                    { effect: 'party', icon: '🎉', label: 'حفلة زهور' }
                  ].map(item => (
                    <button
                      key={item.effect}
                      onClick={() => {
                        // Play locally
                        playSynthesizedSound(item.effect);
                        setFloatingEmojis(prev => [
                          ...prev,
                          { id: Math.random().toString(), char: item.icon, x: Math.random() * 80 + 10, sender: userName }
                        ]);
                        // Broadcast to other users
                        try {
                          const ch = new BroadcastChannel('kino-vocals-channel');
                          ch.postMessage({ type: 'sound-fx', effect: item.effect, userName });
                          ch.close();
                        } catch (e) {}
                      }}
                      className="flex items-center gap-0.5 px-2.5 py-1 hover:bg-white/5 active:scale-95 rounded-xl text-[9px] font-black text-white hover:text-pink-400 transition-all"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area - Beautiful styled message bubbles */}
              <div className="relative w-full px-5 h-28 z-10 flex flex-col mb-1.5">
                <div 
                  ref={roomChatContainerRef}
                  className="overflow-y-auto no-scrollbar space-y-1.5 h-full flex flex-col pointer-events-auto pb-1"
                >
                  <div className="flex-1" />
                  {roomMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className="flex items-start gap-1.5 animation-fade-in"
                    >
                      {msg.userName === 'عجلة الحظ 🎡' || msg.type === 'system' ? (
                        <div className="bg-yellow-500/20 rounded-xl px-3 py-1.5 border border-yellow-500/30 shadow-md w-full text-center">
                          <span className="text-[10px] text-yellow-300 font-extrabold">{msg.text}</span>
                        </div>
                      ) : (
                        <div className="bg-black/55 rounded-2xl px-3 py-1 border border-white/5 shadow-sm max-w-[85%]">
                          <span className="text-[10.5px] font-black text-pink-400 mr-1.5">{msg.userName}:</span>
                          <span className="text-[10.5px] text-white/95 leading-relaxed">{msg.text}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div id="room-messages-end" />
                </div>
              </div>
            </main>

            {/* Room Footer Actions - Optimized */}
            <footer className="relative z-30 p-3 pb-3 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
               {/* Chat Input Field */}
               <div className="flex items-center gap-2 bg-white/10 p-1 px-4 rounded-2xl border border-white/10 shadow-inner">
                 <input 
                   type="text"
                   value={newRoomMessage}
                   onChange={(e) => setNewRoomMessage(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendRoomChat()}
                   placeholder="اكتب تعليقاً في البث المباشر..."
                   className="flex-1 bg-transparent border-none outline-none text-white text-xs py-2 placeholder:text-white/20"
                 />
                 <button onClick={handleSendRoomChat} className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl text-white shadow-md active:scale-95 transition-all">
                   <Send size={13} />
                 </button>
               </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2.5">
                  {/* Lucky Wheel shortcut button */}
                  <button 
                    onClick={() => {
                      setLuckyWheelResult(null);
                      setShowLuckyWheel(true);
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 flex items-center justify-center border border-yellow-300/30 text-white shadow-xl active:scale-90 animate-pulse"
                    title="عجلة الحظ لربح الكوينز"
                  >
                    <span className="text-lg">🎡</span>
                  </button>

                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10">
                     <Layout size={20} className="text-white/80" />
                  </button>
                  <button 
                    onClick={() => setShowGifts(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg active:scale-95 border border-pink-400/50 hover:opacity-90"
                  >
                    <GiftIcon size={22} className="text-white filter drop-shadow" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                    <button 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-green-500 text-white shadow-inner animate-pulse' : 'bg-transparent text-white/50'}`}
                      title={isMicOn ? 'اطفاء الميكروفون' : 'تشغيل الميكروفون'}
                    >
                      <Mic size={16} className={`${isMicOn ? 'text-black font-black' : 'text-white'}`} />
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white">
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </footer>

            
            {/* Lucky Wheel overlay was moved globally to root */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Grid Tray Overlay */}
      <AnimatePresence>
        {showGifts && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGifts(false)}
              className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-[130] bg-[#0F0B21] rounded-t-[40px] flex flex-col max-w-md mx-auto border-t border-white/5 pb-8 overflow-hidden"
              dir="rtl"
            >
              {/* Top Global Gift Banner */}
              <div className="bg-gradient-to-r from-purple-900/40 via-purple-600/20 to-purple-900/40 p-3 flex items-center justify-center gap-3 relative border-b border-white/5">
                <div className="text-xl animate-spin-slow">🌍</div>
                <div className="flex flex-col items-center">
                   <p className="text-[10px] font-black text-white/90 leading-tight">أرسل هدية عالمية وسيشاهدها أيضاً الأشخاص في الغرف الأخرى!</p>
                   <span className="text-[8px] font-bold text-amber-400">الهدية العالمية ✨</span>
                </div>
              </div>

              {/* No recipient chosen message */}
              <div className="py-4 flex justify-center border-b border-white/5">
                <p className="text-[11px] font-bold text-gray-500">لا يوجد أحد لارسال الهدايا له</p>
              </div>

              {/* Category Tabs */}
              <div className="flex items-center px-6 gap-8 overflow-x-auto no-scrollbar py-4 border-b border-white/5">
                <ToolItem 
                  icon={<Backpack size={20} className="text-gray-400" />} 
                  label="" 
                  onClick={() => {
                    setShowGifts(false);
                    setShowBackpack(true);
                  }}
                />
                {['الحدث', 'الهدايا الرائجة', 'الحظ', 'البلاد', 'الهدايا الخ'].map((tab) => (
                   <button 
                    key={tab}
                    className={`whitespace-nowrap text-sm font-black transition-all relative pb-2 ${tab === 'الهدايا الرائجة' ? 'text-white' : 'text-gray-500'}`}
                   >
                     {tab}
                     {tab === 'الهدايا الرائجة' && (
                       <motion.div layoutId="gift-tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
                     )}
                   </button>
                ))}
              </div>

              {/* Gift Grid */}
              <div className="grid grid-cols-4 gap-y-6 gap-x-2 p-6 max-h-[45vh] overflow-y-auto no-scrollbar">
                {GIFTS.map((gift) => (
                  <motion.button
                    key={gift.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSendGift(gift)}
                    className="flex flex-col items-center gap-2 group relative"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center transition-all">
                      <div className="text-4xl drop-shadow-2xl group-active:scale-125 transition-transform">{gift.icon}</div>
                      
                      {/* Badge Simulation */}
                      {gift.price >= 20000 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-[6px] px-1.5 py-0.5 rounded-full font-black text-white shadow-lg border border-white/20">GLOBAL</span>
                      )}
                      {gift.price === 5000 && (
                        <div className="absolute top-0 right-0 bg-blue-500 rounded p-0.5"><Volume2 size={6} /></div>
                      )}
                      
                      <div className="absolute -bottom-1 right-0 flex gap-0.5">
                        <div className="bg-blue-400 rounded-full p-0.5 border border-[#0F0B21]"><TrendingUp size={6} /></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] font-black text-white/80">{gift.price.toLocaleString()}</span>
                      <div className="flex items-center gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex items-center justify-center">
                           <Coins size={8} className="text-yellow-900" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Gift Footer */}
              <div className="mt-auto p-4 flex flex-col gap-4 bg-black/40 border-t border-white/5">
                 {/* Quick Multipliers / Amounts */}
                 <div className="flex items-center justify-between px-4">
                    <button className="gradient-pink rounded-full px-6 py-2 text-sm font-black shadow-lg shadow-pink-500/20 active:scale-95 transition-transform">إرسال</button>
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                       {['777', '177', '77', '17', '7', '1'].map((num) => (
                          <button key={num} className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${num === '1' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                            {num}
                          </button>
                       ))}
                       <span className="text-[10px] font-bold text-gray-600 ml-2">غيرها</span>
                    </div>
                 </div>

                 {/* Balance display */}
                 <div className="flex justify-end gap-2 pr-4">
                    <button 
                      onClick={() => setShowRecharge(true)}
                      className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 active:scale-95 transition-all"
                    >
                      <span className="text-xs font-black text-white">{coins.toLocaleString()}</span>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Coins size={10} className="text-yellow-900" />
                      </div>
                      <ChevronLeft size={10} className="text-gray-500" />
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {activeProfile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProfile(null)}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 z-[210] bg-white rounded-t-[32px] flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl max-h-[72vh]"
              dir="rtl"
            >
              <div className="overflow-y-auto no-scrollbar flex-1 pb-24">
                {/* Profile Background & Avatar Section */}
                <div className="relative h-40 bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-end shrink-0">
                  <button 
                    onClick={() => setActiveProfile(null)}
                    className="absolute top-4 left-6 p-1.5 bg-black/5 rounded-full z-30"
                  >
                    <CircleAlert size={18} className="text-gray-400" />
                  </button>

                  <div className="relative mb-[-30px]">
                    {/* Gold Frame Design */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none z-10 flex items-center justify-center">
                        <div className="relative">
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400/20 rounded-full blur-[15px]"></div>
                           <Crown size={32} className="text-amber-500 fill-amber-200" />
                        </div>
                    </div>
                    
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-0">
                      <img src={activeProfile.avatar} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                  </div>
                </div>

                {/* User Identity Section */}
                <div className="pt-10 px-8 flex flex-col items-center">
                  <h2 className="text-lg font-black text-gray-800 flex items-center gap-1.5">
                    ✨ {activeProfile.name}
                  </h2>
                  
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center gap-1 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                      <span className="text-[9px] font-bold text-pink-500">{activeProfile.age}</span>
                      <span className="text-[9px] text-pink-500">♀</span>
                    </div>
                    <div className="bg-red-500 rounded px-1.5 py-0.5 flex items-center justify-center scale-90">
                      <span className="text-[9px] text-white font-bold">{activeProfile.countryFlag}</span>
                    </div>
                    <div className="bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm">
                      Gold ID
                    </div>
                  </div>

                  <p className="mt-2 text-[10px] text-gray-400 font-bold">{activeProfile.signature}</p>
                </div>

                {/* Medals Carousel */}
                <div className="mt-4 px-6">
                   <div className="bg-amber-50/40 rounded-xl p-3 flex items-center justify-between border border-amber-100/50">
                      <button className="text-amber-600/30"><ChevronLeft size={16} /></button>
                      <div className="flex gap-3">
                         <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                            <Medal size={20} className="text-emerald-500" />
                         </div>
                         <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
                            <Trophy size={20} className="text-orange-500" />
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-amber-700">ميداليات {activeProfile.medalsCount}</span>
                   </div>
                </div>

                {/* Stats Cards Section */}
                <div className="mt-4 px-6 grid grid-cols-3 gap-2">
                   <div className="bg-indigo-600 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1">
                      <span className="text-[7px] text-indigo-100">مستوى...</span>
                      <div className="flex items-center gap-1">
                         <span className="text-base font-black text-white">{activeProfile.level}</span>
                         <Shield size={8} className="text-white/80" />
                      </div>
                   </div>
                   
                   <div className="bg-orange-500 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1">
                      <span className="text-[7px] text-orange-100">مستوى المذيع</span>
                      <div className="flex items-center gap-1">
                         <span className="text-base font-black text-white">{activeProfile.broadcasterLevel}</span>
                         <Flame size={8} className="text-white/80" />
                      </div>
                   </div>

                   <div className="bg-blue-600 rounded-xl p-2.5 flex flex-col items-center justify-center gap-1">
                      <span className="text-[7px] text-blue-100 truncate w-full text-center">{activeProfile.signature}</span>
                      <div className="flex items-center gap-1">
                         <span className="text-base font-black text-white">1</span>
                         <div className="w-3 h-3 rounded-full overflow-hidden border border-white/30">
                            <img src={activeProfile.avatar} className="w-full h-full object-cover" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Relationship Section */}
                <div className="mt-3 px-6">
                   <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col items-center justify-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-3 py-0.5 rounded-full">الثنائي الخاص بي</span>
                      <span className="text-[9px] font-medium text-pink-400">
                         ليس هناك ثنائي موجود. كن أول ثنائي له!
                      </span>
                   </div>
                </div>
              </div>

              {/* Footer Actions - Absolute Bottom Fixed */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 flex items-center gap-3 bg-white border-t border-gray-50">
                 <button className="flex-1 bg-[#00E5FF] text-white font-black py-3 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-transform text-sm shadow-lg shadow-cyan-100">
                    <Plus size={18} className="stroke-[3px]" />
                    متابعة
                 </button>
                 
                 <div className="flex gap-2">
                    <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-pink-500 active:scale-90 transition-transform">
                       <GiftIcon size={20} />
                    </button>
                    <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-rose-500 active:scale-90 transition-transform">
                       <Heart size={20} />
                    </button>
                    <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-indigo-500 active:scale-90 transition-transform">
                       <MessageCircle size={20} />
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Recharge Modal */}
      <AnimatePresence>
        {showRecharge && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecharge(false)}
              className="fixed inset-0 z-[310] bg-black/70 backdrop-blur-md max-w-md mx-auto"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[320] bg-[#F7F7FA] rounded-t-[40px] flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl h-[85vh]"
              dir="rtl"
            >
              <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
                <button onClick={() => setShowRecharge(false)} className="text-gray-400 p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
                <h2 className="text-xl font-black text-gray-800">إعادة شحن العملات</h2>
                <div className="w-10"></div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {/* Current Balance Card */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 shadow-xl shadow-amber-500/20 flex items-center justify-between overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                   <div className="flex flex-col gap-1 relative z-10">
                      <span className="text-white/80 text-sm font-bold">رصيدك الحالي</span>
                      <div className="flex items-center gap-2">
                         <span className="text-white text-3xl font-black tracking-tighter">{coins.toLocaleString()}</span>
                         <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
                            <Coins size={14} className="text-yellow-900" />
                         </div>
                      </div>
                   </div>
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-sm">
                      <Shield size={32} className="text-white" />
                   </div>
                </div>

                {/* Recharge Options Grid */}
                <div className="space-y-4">
                   <h3 className="text-sm font-black text-gray-400 pr-2 uppercase tracking-widest">اختر باقة الشحن</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                        { coins: 560, price: '1.00$', label: 'باقة المبتدئين' },
                        { coins: 2850, price: '5.00$', label: 'باقة برونزية' },
                        { coins: 5800, price: '10.00$', label: 'باقة فضية' },
                        { coins: 12000, price: '20.00$', label: 'باقة ذهبية' },
                        { coins: 31000, price: '50.00$', label: 'باقة بلاتينية' },
                        { coins: 65000, price: '100.00$', label: 'باقة ملكية' }
                      ].map((pkg) => (
                        <motion.button
                          key={pkg.coins}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setCoins(prev => prev + pkg.coins);
                            setShowRecharge(false);
                            setActiveGift(`تم شحن ${pkg.coins} عملة بنجاح! 🎉`);
                            setTimeout(() => setActiveGift(null), 2000);
                          }}
                          className="bg-white border border-gray-100 p-4 rounded-[28px] flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:bg-amber-50 group active:border-amber-200"
                        >
                           <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Coins size={20} className="text-amber-500" />
                           </div>
                           <div className="flex flex-col items-center">
                              <span className="text-lg font-black text-gray-800">{pkg.coins.toLocaleString()}</span>
                              <span className="text-[10px] text-gray-400 font-bold">{pkg.label}</span>
                           </div>
                           <div className="mt-1 w-full bg-[#1F1F1F] text-white py-2 rounded-xl text-xs font-black shadow-lg">
                              {pkg.price}
                           </div>
                        </motion.button>
                      ))}
                   </div>
                </div>

                {/* Security Message */}
                <div className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 border border-gray-200/50">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                      <Lock size={18} className="text-green-500" />
                   </div>
                   <p className="text-[10px] font-bold text-gray-500 leading-relaxed">
                      جميع عمليات الدفع مشفرة وآمنة تماماً. كينو لايف تضمن لك سرعة وصول العملات إلى حسابك فور إتمام العملية.
                   </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGift && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -100 }}
            className="fixed top-1/3 left-0 right-0 z-[100] flex justify-center pointer-events-none"
          >
            <div className="gradient-pink px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20">
              <div className="animate-bounce">🎁</div>
              <span className="font-bold text-white whitespace-nowrap">{activeGift}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  // Check if home tab is active to display the exquisite custom mosque/palace SVG icon
  let customIcon = icon;
  const isHomeActive = label === "الرئيسية" && active;
  
  if (isHomeActive) {
    customIcon = (
      <div className="relative flex flex-col items-center">
        {/* Glow behind the active temple */}
        <div className="absolute -inset-2 bg-[#FC68AA]/25 rounded-full blur-md"></div>
        <svg width="34" height="34" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_0_8px_rgba(252,104,170,0.8)] animate-pulse">
          {/* Main Palace Base */}
          <path d="M10 80 H90 V85 H10 Z" fill="#D4AF37" />
          {/* Central Dome */}
          <path d="M40 50 C40 30, 60 30, 60 50 Z" fill="#FF8BB5" stroke="#D4AF37" strokeWidth="2.5" />
          <path d="M50 20 V30" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 20 C48 18, 52 18, 52 20 Z" fill="#D4AF37" />
          {/* Left Dome */}
          <path d="M22 62 C22 45, 38 45, 38 62 Z" fill="#FF8BB5" stroke="#D4AF37" strokeWidth="2" />
          <path d="M30 35 V45" stroke="#D4AF37" strokeWidth="2" />
          {/* Right Dome */}
          <path d="M62 62 C62 45, 78 45, 78 62 Z" fill="#FF8BB5" stroke="#D4AF37" strokeWidth="2" />
          <path d="M70 35 V45" stroke="#D4AF37" strokeWidth="2" />
          {/* Arch pillars / windows with glowing purple color */}
          <rect x="46" y="58" width="8" height="15" rx="4" fill="#580D7A" stroke="#D4AF37" strokeWidth="1.5" />
          <rect x="27" y="66" width="6" height="10" rx="3" fill="#580D7A" stroke="#D4AF37" strokeWidth="1.5" />
          <rect x="67" y="66" width="6" height="10" rx="3" fill="#580D7A" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Corner spires */}
          <path d="M14 55 L16 80 L12 80 Z" fill="#D4AF37" />
          <path d="M86 55 L88 80 L84 80 Z" fill="#D4AF37" />
        </svg>
      </div>
    );
  }

  const activeColorClass = isHomeActive ? 'text-[#FC68AA] font-black' : (active ? 'text-[#D4AF37] font-black' : 'text-[#9B7C3E]/70 font-bold hover:text-[#D4AF37] hover:opacity-100');

  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        scale: active ? 1.12 : 1,
        y: active ? -5 : 0
      }}
      transition={{ type: 'spring', damping: 15, stiffness: 350 }}
      className={`flex flex-col items-center gap-1 relative cursor-pointer transition-all ${activeColorClass}`}
    >
      <div className={`transition-all duration-300 ${active ? (isHomeActive ? 'drop-shadow-[0_0_12px_rgba(252,104,170,0.5)]' : 'drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]') : ''}`}>
        {customIcon}
      </div>
      <span className="text-[10px] tracking-tight mt-0.5">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className={`absolute -bottom-2.5 w-1.5 h-1.5 rounded-full ${isHomeActive ? 'bg-[#FC68AA] shadow-[0_0_6px_#FC68AA]' : 'bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]'}`}
        />
      )}
    </motion.button>
  );
}

function ProfilePage({ 
  level, 
  userName, 
  userAvatar, 
  setUserAvatar,
  onShowFull, 
  onShowBackpack, 
  setShowRecharge 
}: { 
  level: number, 
  userName: string, 
  userAvatar: string,
  setUserAvatar: (val: string) => void,
  onShowFull: () => void, 
  onShowBackpack: () => void, 
  setShowRecharge: (val: boolean) => void 
}) {
  return (
    <div className="flex flex-col bg-[#1D0335] text-white cursor-pointer" dir="rtl" onClick={onShowFull}>
      {/* Profile Header Gradient */}
      <div 
        className="h-80 bg-gradient-to-b from-[#2D0B4B]/80 via-[#1D0335] to-[#1D0335] relative flex flex-col items-center pt-12 overflow-hidden"
      >
        {/* Soft decorative circles for the specific "Mico" vibe */}
        <div className="absolute top-0 -left-10 w-48 h-48 bg-[#6A1B9A]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-10 -right-10 w-40 h-40 bg-[#2D0B4B]/20 rounded-full blur-3xl"></div>
        
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-3">
            <button className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/25 p-2.5 rounded-full backdrop-blur-md shadow-md active:scale-90 transition-transform">
              <Settings size={22} />
            </button>
            <button className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/25 p-2.5 rounded-full backdrop-blur-md shadow-md active:scale-90 transition-transform">
              <Edit3 size={22} />
            </button>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/25 p-2.5 rounded-full backdrop-blur-md shadow-md active:scale-90 transition-transform">
              <QrCode size={22} />
            </button>
            <button className="bg-[#2D0B4B]/80 text-[#D4AF37] border border-[#D4AF37]/25 p-2.5 rounded-full backdrop-blur-md shadow-md active:scale-90 transition-transform">
              <Calendar size={22} />
            </button>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="relative mb-4 z-10 mt-6 animate-pulse">
          <div className="w-32 h-32 rounded-full border-[5px] border-[#D4AF37]/60 p-1 overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.15)] bg-[#1D0335] relative">
            <img src={userAvatar} className="w-full h-full rounded-full object-cover" alt="Profile" />
          </div>
          {/* Hexagonal Level Badge - Updated to Orange */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-1 rounded-lg text-[11px] font-black text-white border-2 border-[#D4AF37]/40 shadow-2xl flex items-center justify-center min-w-[50px] z-20">
            {level}
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-1 z-10 tracking-wide mt-2">{userName}</h2>
        <div className="flex items-center gap-1.5 text-[#D4AF37] text-sm font-semibold z-10 bg-[#2D0B4B]/60 px-3 py-0.5 rounded-full backdrop-blur-sm border border-[#D4AF37]/15">
          <span className="opacity-70">Keno ID:</span>
          <span>100100</span>
          <Copy size={14} className="cursor-pointer active:scale-75 transition-transform text-[#FC68AA] mr-1" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-4 py-8 px-4 bg-[#2D0B4B]/20 border-y border-[#D4AF37]/10">
        <StatItem value="23" label="الأصدقاء" />
        <StatItem value="30" label="أتابعهم" />
        <StatItem value="26" label="المتابعين" />
        <StatItem value="0" label="المجموعات" />
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-[#1D0335]">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="h-28 bg-gradient-to-br from-[#6A1B9A] to-[#1F033A] rounded-[24px] p-4 flex flex-col items-center justify-center gap-3 shadow-xl border border-[#D4AF37]/20 relative group overflow-hidden"
        >
          <div className="bg-white/10 p-2 rounded-full group-hover:scale-110 transition-transform border border-white/10">
            <Mic size={26} className="text-[#D4AF37]" />
          </div>
          <span className="text-xs font-bold leading-tight text-white/90">مركز مذيع البث<br/>المباشر</span>
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); setShowRecharge(true); }}
          className="h-28 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[24px] p-4 flex flex-col items-center justify-center gap-3 shadow-xl border border-white/20 relative group overflow-hidden"
        >
          <div className="bg-white/10 p-2 rounded-full group-hover:scale-110 transition-transform border border-white/10">
            <Coins size={26} className="text-yellow-200" />
          </div>
          <span className="text-xs font-bold text-white">إعادة شحن الذهب</span>
        </motion.button>
      </div>

      {/* VIP Banner - Drama */}
      <div className="px-4 mb-8 bg-[#1D0335] pb-4">
        <div className="relative h-24 rounded-2xl overflow-hidden group border border-[#D4AF37]/20 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1594908941016-209e897e0812?q=80&w=800&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75 flex items-center justify-between px-6 backdrop-blur-[0.5px]">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#D4AF37] drop-shadow">اشترك في DNGR Drama VIP</span>
              <span className="text-[11px] text-gray-300 font-medium">شاهد جميع الدراما القصيرة مجاناً</span>
            </div>
            <button className="bg-[#D4AF37] text-black text-[12px] font-black px-6 py-2 rounded-full hover:bg-amber-300 transition-colors shadow-2xl active:scale-90">
              متابعة
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid Section */}
      <div className="bg-[#2D0B4B]/35 rounded-t-[38px] px-4 pt-10 pb-20 border-t border-[#D4AF37]/10 shadow-2xl">
        <div className="grid grid-cols-3 gap-y-12">
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">👻</div>} label="آخر الزوار" />
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">⭐</div>} label="مستوى المستخدم" />
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">🎒</div>} label="حقيبة الظهر" onClick={onShowBackpack} />
          
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">🐱</div>} label="Lucky cat" />
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">🛡️</div>} label="العائلة" isNew />
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">🎮</div>} label="ردهة الألعاب" isNew />
          
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">👑</div>} label="مركز الـVIP" />
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">🎉</div>} label="الفعاليات" isNew />
          <ToolItem icon={<div className="text-4xl drop-shadow-sm">🪙</div>} label="نشاطاتي" isNew />
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold text-[#D4AF37]">{value}</span>
      <span className="text-[11px] text-[#C1AFD6] font-medium mt-1">{label}</span>
    </div>
  );
}

function ToolItem({ icon, label, isNew = false, onClick }: { icon: ReactNode, label: string, isNew?: boolean, onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <div className="w-20 h-20 rounded-[22px] bg-[#2D0B4B]/80 flex items-center justify-center relative group-hover:bg-[#3D0B65] transition-all shadow-md border border-[#D4AF37]/15 group-hover:border-[#D4AF37]/45 group-hover:scale-105 active:scale-95 overflow-visible">
        {icon}
        {isNew && (
          <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-lg font-black shadow-lg ring-4 ring-[#1D0335] animate-pulse">NEW</span>
        )}
      </div>
      <span className="text-[12px] font-semibold text-[#D5C2E6] group-hover:text-[#D4AF37] transition-colors">{label}</span>
    </div>
  );
}

function SocialPage({ chats, onOpenChat }: { chats: Chat[], onOpenChat: (id: number) => void }) {
  return (
    <div className="flex flex-col min-h-full bg-white" dir="rtl">
      <header className="p-6 pt-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">الرسائل</h2>
        <div className="flex gap-4">
           <button className="p-2.5 bg-gray-50 rounded-2xl text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-all">
             <Users size={22} />
           </button>
           <button className="p-2.5 bg-gray-50 rounded-2xl text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-all">
             <Search size={22} />
           </button>
        </div>
      </header>

      <div className="flex-1 px-4 space-y-2">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenChat(chat.id)}
            className="flex items-center gap-4 p-4 rounded-[24px] hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-100"
          >
            <div className="relative">
              <img src={chat.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt={chat.userName} />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 truncate">{chat.userName}</h3>
                <span className="text-[10px] text-gray-400 font-medium">{chat.lastTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black min-w-[18px] text-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChatWindow({ chat, onClose, onSendMessage }: { chat: Chat, onClose: () => void, onSendMessage: (text: string) => void }) {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-[150] bg-white flex flex-col max-w-md mx-auto"
      dir="rtl"
    >
      <header className="p-4 pt-10 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={24} />
          </button>
          <div className="flex items-center gap-3">
             <img src={chat.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
             <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{chat.userName}</h3>
                <span className="text-[10px] text-green-500 font-bold">متصل الآن</span>
             </div>
          </div>
        </div>
        <div className="flex gap-1">
           <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><MoreVertical size={20} /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50">
        {chat.messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] px-4 py-2.5 rounded-[20px] shadow-sm text-sm ${
              msg.sender === 'me' 
                ? 'bg-pink-500 text-white rounded-br-none' 
                : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
            }`}>
              <p>{msg.text}</p>
              <span className={`text-[9px] block mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-50 pb-8 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-1">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..." 
            className="flex-1 outline-none text-sm bg-transparent py-2.5"
          />
          <Smile size={20} className="text-gray-400 cursor-pointer" />
        </div>
        <button 
          onClick={handleSend}
          disabled={!inputText.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            inputText.trim() ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
}

function FullProfileView({ 
  level, 
  userName,
  setUserName,
  userAvatar,
  setUserAvatar,
  onClose 
}: { 
  level: number, 
  userName: string,
  setUserName: (val: string) => void,
  userAvatar: string,
  setUserAvatar: (val: string) => void,
  onClose: () => void 
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [accountAgeDays] = useState<number>(() => {
    const savedTime = localStorage.getItem('user_created_at');
    let createdAt = 0;
    if (!savedTime) {
      createdAt = Date.now();
      localStorage.setItem('user_created_at', createdAt.toString());
    } else {
      createdAt = parseInt(savedTime, 10);
      if (isNaN(createdAt)) {
        createdAt = Date.now();
        localStorage.setItem('user_created_at', createdAt.toString());
      }
    }
    const diffMs = Date.now() - createdAt;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar"
      dir="rtl"
    >
      {/* Hidden file selector */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Pitch-Black Top Banner Section */}
      <div className="relative h-[48vh] shrink-0 bg-[#000000] flex flex-col justify-between p-6">
        
        {/* Phone UI status bar mimicry for top-notch fidelity */}
        <div className="flex justify-between items-center text-white/50 text-[11px] font-semibold tracking-wide select-none">
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded-[3px]">4.5G</span>
            <span>126 KB/s</span>
          </div>
          {/* Dynamic Island Mimicry */}
          <div className="bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/5 shadow-inner text-[10px] text-white/95">
             <span className="w-1.5 h-1.5 bg-[#FC68AA] rounded-full animate-ping"></span>
             <span>٢</span>
          </div>
          <span>٢:٣١</span>
        </div>

        {/* Action Controls directly below status bar */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3">
            <button 
              onClick={triggerSelectFile}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 rounded-full transition-all relative group"
              title="تغيير صورة الملف الشخصي"
            >
              <Camera size={20} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">تغير الصورة</span>
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 rounded-full transition-all">
              <Layout size={20} />
            </button>
            <button className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 rounded-full transition-all">
              <RefreshCcw size={20} />
            </button>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 rounded-full transition-all">
            <ChevronLeft size={22} />
          </button>
        </div>

        {/* Floating Items Area inside the black top half */}
        <div className="flex-1 relative mt-4">
          
          {/* LEFT: Luxurious Winged Crown Badge */}
          <div className="absolute left-2 bottom-8 z-10 flex flex-col items-center">
            <div className="relative">
              {/* Fluttery white wings on the background */}
              <div className="absolute -inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none select-none">
                {/* Left wing (pointing left-up) */}
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200/40 rounded-full blur-[1px] rotate-12 flex items-center justify-center shadow-lg border-2 border-white/40">
                  <span className="text-white text-[10px] font-bold">🕊️</span>
                </div>
                {/* Right wing (pointing right-up) */}
                <div className="w-10 h-10 bg-gradient-to-bl from-white to-gray-200/40 rounded-full blur-[1px] -rotate-12 flex items-center justify-center shadow-lg border-2 border-white/40">
                  <span className="text-white text-[10px] font-bold">🕊️</span>
                </div>
              </div>

              {/* Gold double circle inner container */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFF5D1] to-[#D4AF37] p-1 shadow-[0_10px_25px_rgba(212,175,55,0.4)] relative flex items-center justify-center z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFD54F] to-[#E65100] p-0.5 flex items-center justify-center overflow-hidden">
                  {/* Glowing cute yellow character */}
                  <div className="w-full h-full rounded-full bg-amber-500 flex items-center justify-center relative">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>

                {/* Sparkling Royal Crown on Top of Badge */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]">
                  <span className="text-2xl">👑</span>
                </div>

                {/* Micro gold star footer */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-amber-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-yellow-200 shadow shadow-amber-950/20">
                  ★
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Main Profile Avatar with VIP tag */}
          <div className="absolute right-0 bottom-[-22px] z-20">
            <div className="relative cursor-pointer group" onClick={triggerSelectFile} title="انقر لتغيير الصورة">
              <div className="w-[105px] h-[105px] rounded-full border-[4px] border-white shadow-[0_12px_36px_rgba(0,0,0,0.4)] p-0.5 bg-black overflow-hidden relative">
                <img 
                  src={userAvatar} 
                  className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform" 
                  alt="Profile Avatar"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              {/* V Badge bottom left */}
              <div className="absolute bottom-1 left-1 bg-gradient-to-tr from-amber-500 via-[#FC68AA] to-[#7B1FA2] text-white w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-black text-[12px]">
                V
              </div>
            </div>
          </div>

          {/* CENTER BOTTOM: Page indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
             <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/45"></div>
          </div>

        </div>
      </div>

      {/* Main Profile Content (Beautiful White Container) */}
      <div className="flex-1 bg-white rounded-t-[34px] relative z-20 px-5 pt-5 pb-10 flex flex-col">
        
        {/* Dynamic header items: "وقت" banner in top left, Name + ID on right */}
        <div className="flex justify-between items-start mb-6">
          
          {/* LEFT: Beautiful glowing time banner */}
          <div className="bg-gradient-to-r from-[#FF4081] via-[#F50057] to-[#C51162] text-white rounded-full text-[10px] font-extrabold px-3 py-1.5 flex items-center gap-1.5 shadow-md shadow-pink-500/20">
            <span className="text-sm">📱</span>
            <div className="flex flex-col text-right leading-none">
              <span className="text-[7px] text-white/80 opacity-90">وقت:</span>
              <span className="text-[10px] tracking-tight">{accountAgeDays} يوم/أيام</span>
            </div>
          </div>

          {/* RIGHT: Name and edit controls */}
          <div className="text-right flex-1">
            <div className="flex items-center gap-2 justify-end">
              {isEditingName ? (
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-pink-200">
                  <button 
                    onClick={() => {
                      if (tempName.trim()) {
                        setUserName(tempName.trim());
                        setIsEditingName(false);
                      }
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-transform"
                    title="حفظ"
                  >
                    ✓
                  </button>
                  <button 
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 active:scale-95 text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-transform"
                    title="إلغاء"
                  >
                    ✕
                  </button>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="font-black text-[#1D0335] text-right bg-transparent px-2 outline-none w-32 text-base"
                    autoFocus
                    maxLength={20}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-end">
                  <button 
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className="text-pink-500 hover:text-pink-600 p-1 bg-pink-50 hover:bg-pink-100 rounded-full active:scale-90 transition-all shrink-0"
                    title="تعديل الاسم"
                  >
                    <Edit3 size={15} />
                  </button>
                  <span className="text-2xl font-black text-[#1D0335] leading-none tracking-tight">
                    {userName}
                  </span>
                </div>
              )}
            </div>
            {/* Horizontal Info tags underneath the name */}
            <div className="flex items-center gap-1.5 justify-end mt-2">
              <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-0.5 border border-orange-400/40 shadow-sm animate-pulse">
                <span>Lv.</span> {level}
              </span>
              <span className="bg-[#E1F5FE] text-[#0288D1] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-[#B3E5FC]/40">
                <span className="text-[9px]">♂</span> 24
              </span>
              <span className="bg-[#EDE7F6] text-[#673AB7] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-[#D1C4E9]/40">
                <span>🌙</span> 23
              </span>
              <span className="text-lg leading-none" title="مصر">🇪🇬</span>
            </div>
          </div>

        </div>

        {/* Gift Status Section */}
        <div className="flex justify-between items-center text-xs text-[#90A4AE] font-bold mb-6 border-b border-gray-100 pb-4 px-1">
          <div className="flex items-center gap-1">
            <span className="text-[#CFD8DC]">Coins:</span>
            <span className="text-amber-500 font-extrabold text-sm">★</span>
          </div>
          <div>935K تم الإرسال</div>
        </div>

        {/* Navigation Tabs (ملف التعريف - جدار الشرف) */}
        <div className="flex border-b border-gray-100 mb-6 relative">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 pb-3 text-base font-extrabold text-center transition-all relative ${activeTab === 'profile' ? 'text-[#1D0335] scale-102' : 'text-[#90A4AE]'}`}
          >
            ملف التعريف
            {activeTab === 'profile' && (
              <motion.div layoutId="profile-tab-pill" className="absolute bottom-0 left-1/3 right-1/3 h-[3.5px] bg-[#9C27B0] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('honor')}
            className={`flex-1 pb-3 text-base font-extrabold text-center transition-all relative ${activeTab === 'honor' ? 'text-[#1D0335] scale-102' : 'text-[#90A4AE]'}`}
          >
            جدار الشرف
            {activeTab === 'honor' && (
              <motion.div layoutId="profile-tab-pill" className="absolute bottom-0 left-1/3 right-1/3 h-[3.5px] bg-[#9C27B0] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content rendering specific sub components */}
        {activeTab === 'profile' ? (
          <div className="space-y-5">
            
            {/* FEATURED CODE: Slate-colored lion watermarked level card */}
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-l from-[#191D30] via-[#0E111F] to-[#191D30] border border-[#232946] p-4 flex items-center justify-between shadow-lg">
              
              {/* Lion Vector Watermark background on the left */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none text-[64px] filter grayscale">
                🦁
              </div>

              {/* LV badge and name */}
              <div className="z-10 flex flex-col justify-center text-right pr-2">
                <span className="text-white text-lg font-black tracking-wide mb-1">{userName}</span>
                <span className="text-[#D4AF37] text-xs font-extrabold tracking-widest bg-amber-500/10 border border-[#D4AF37]/30 rounded-full px-3 py-0.5">
                  Lv.2
                </span>
              </div>

              {/* Angry cute cool red character badge on the right */}
              <div className="relative z-10 w-16 h-16 rounded-2xl border-2 border-red-500/30 bg-red-950/40 p-1 flex items-center justify-center shadow-md shadow-red-500/10">
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#2C0B4B] flex items-center justify-center">
                  <span className="text-4xl filter drop-shadow">👹</span>
                </div>
                {/* Micro crown on the character */}
                <span className="absolute -top-3 -right-2 text-base">👑</span>
              </div>
            </div>

            {/* FEATURED CODE: Supporters Card ("الأقوى") */}
            <div className="bg-[#F8F9FB] rounded-[22px] p-4 flex items-center justify-between border border-gray-100 shadow-sm">
              {/* Overlapping gold-crowned avatar list on the left */}
              <div className="flex items-center -space-x-4">
                
                {/* Supporter 1 */}
                <div className="relative z-30">
                  <div className="w-11 h-11 rounded-full border-2 border-[#D4AF37] p-[1px] bg-white shadow-md">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="absolute -top-3.5 -left-1 text-xs drop-shadow">👑</span>
                </div>

                {/* Supporter 2 */}
                <div className="relative z-20">
                  <div className="w-11 h-11 rounded-full border-2 border-slate-300 p-[1px] bg-white shadow-md">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="absolute -top-3 -left-1 text-xs drop-shadow">👑</span>
                </div>

                {/* Supporter 3 */}
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-full border-2 border-amber-600/40 p-[1px] bg-white shadow-md">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                  </div>
                  <span className="absolute -top-3 -left-1 text-xs drop-shadow">👑</span>
                </div>

              </div>

              {/* Text column and eye icon on the right */}
              <div className="flex items-center gap-2.5">
                <span className="text-[#1D0335] text-sm font-extrabold">المتابعين الأقوى</span>
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <Eye size={14} />
                </div>
              </div>
            </div>

            {/* FEATURED CODE: Ludo game activity banner */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 rounded-[22px] p-4 relative overflow-hidden flex items-center justify-between text-white shadow-md shadow-orange-500/15">
              
              {/* Gold Round medallion on the left */}
              <div className="w-11 h-11 rounded-full border-[3px] border-amber-100 bg-[#FF6F00] flex items-center justify-center font-black text-white text-base shadow-md">
                1
              </div>

              {/* Title, dots, and layout of Ludo in the middle */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right pr-2">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-white font-black text-lg">Ludo</span>
                    <span className="text-base">👑</span>
                  </div>
                  <div className="flex gap-1 justify-end mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E57373]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#81C784]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#64B5F6]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFD54F]"></div>
                  </div>
                </div>

                {/* Dice/board illustration on the right */}
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-2xl border border-white/10">
                  🎲
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
              <Medal size={36} />
            </div>
            <p className="text-sm font-bold text-gray-500">لا توجد أوسمة حالياً</p>
          </div>
        )}

      </div>
    </motion.div>
  );
}

function BackpackView({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('decor');
  const [activeFilter, setActiveFilter] = useState('الكل');

  const categories = [
    { id: '1', title: 'الأرستقراطية', status: 'فارغة في الوقت الحالي' },
    { id: '2', title: 'سيارة حصرية', status: 'فارغة في الوقت الحالي' },
    { id: '3', title: 'وضع ديكور للحساب', status: 'فارغة في الوقت الحالي' },
  ];

  const items = [
    { id: '1', title: 'سيارة حصرية', category: 'سيارة حصرية', icon: '🚗', locked: true, status: 'خارج الخدمة', type: 'car' },
    { id: '2', title: 'وضع ديكور للحساب', category: 'وضع ديكور للحساب', icon: '✨', locked: true, status: 'خارج الخدمة', type: 'decor' },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[150] bg-[#F8F9FB] flex flex-col max-w-md mx-auto overflow-hidden"
      dir="rtl"
    >
      {/* Backpack Header */}
      <header className="bg-white px-4 py-8 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight size={28} className="text-gray-800" />
          </button>
          <h2 className="text-2xl font-black text-gray-900">حقيبة الظهر</h2>
        </div>
        <button className="text-sm font-bold text-gray-400">انتهت صلاحيتها</button>
      </header>

      {/* Backpack Tabs */}
      <div className="bg-white flex px-6 border-b border-gray-50">
        <button 
          onClick={() => setActiveTab('decor')}
          className={`px-4 py-4 text-xl font-black relative transition-all ${activeTab === 'decor' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          زخارف
          {activeTab === 'decor' && (
             <motion.div layoutId="back-tab" className="absolute bottom-1 left-4 right-4 h-1.5 bg-purple-600 rounded-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('service')}
          className={`px-8 py-4 text-xl font-black relative transition-all ${activeTab === 'service' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          خدمة
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {/* Equipment Section */}
        <div className="mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-6 px-2">التجهيز</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
            {categories.map((cat) => (
              <div key={cat.id} className="min-w-[160px] bg-white rounded-3xl p-6 flex flex-col items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[30px] flex items-center justify-center relative">
                  <div className="w-12 h-12 border-2 border-gray-200 border-dashed rounded-xl"></div>
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-[30px]"></div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[13px] font-black text-gray-900 mb-1">{cat.title}</span>
                  <span className="text-[10px] text-gray-300 font-bold whitespace-nowrap">{cat.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 px-2">
          {['الكل', 'الأرستقراطية', 'سيارة حصرية', 'وضع ديكور للحساب'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-purple-100 text-purple-600 shadow-sm' : 'bg-gray-100 text-gray-400'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-px bg-gray-100 rounded-[40px] overflow-hidden border border-gray-100 shadow-xl shadow-black/5">
          {/* Empty placeholders to match the image grid feel */}
          <div className="aspect-square bg-white"></div>
          {items.map((item) => (
            <div key={item.id} className="aspect-square bg-white flex flex-col items-center justify-center p-6 relative group">
              <button className="absolute top-4 right-4 text-gray-200 hover:text-purple-500 transition-colors">
                <Eye size={20} />
              </button>
              
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative shadow-inner">
                   <img 
                    src={item.type === 'car' ? "https://cdn-icons-png.flaticon.com/512/744/744465.png" : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    className="w-14 h-14 grayscale opacity-30" 
                    alt="item" 
                   />
                   <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] rounded-full"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md p-3 rounded-full text-white shadow-2xl border border-white/20">
                  <Lock size={20} />
                </div>
                {/* Specific icon badges like in the image */}
                <div className="absolute -top-1 -left-1">
                   {item.type === 'car' ? (
                     <div className="bg-purple-600 p-1.5 rounded-xl border-2 border-white shadow-lg">
                       <Layout size={10} className="text-white" />
                     </div>
                   ) : (
                     <div className="bg-blue-400 p-1.5 rounded-xl border-2 border-white shadow-lg">
                       <User size={10} className="text-white" />
                     </div>
                   )}
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[13px] font-black text-gray-900 mb-1">{item.title}</span>
                <span className="text-[10px] text-blue-400 font-black tracking-wide">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function GameCard({ title, icon, color, onClick }: { title: string, icon: ReactNode, color: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative aspect-square rounded-[40px] ${color} overflow-hidden group shadow-xl border border-white/10`}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
      <div className="relative h-full flex flex-col items-center justify-center p-6 gap-4 z-10">
         <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shadow-inner backdrop-blur-sm group-hover:scale-110 transition-transform">
           {icon}
         </div>
         <span className="text-white font-black text-lg drop-shadow-md tracking-tight">{title}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
    </motion.button>
  );
}

function VeggieGameModal({ onClose, coins, setCoins, setShowRecharge, userAvatar }: { onClose: () => void, coins: number, setCoins: (val: number | ((prev: number) => number)) => void, setShowRecharge: (val: boolean) => void, userAvatar: string }) {
  const [timeLeft, setTimeLeft] = useState(19);
  const [selectedBet, setSelectedBet] = useState(200);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [rotation, setRotation] = useState(0);
  const [winningPulse, setWinningPulse] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [gameState, setGameState] = useState<'betting' | 'spinning' | 'result'>('betting');
  const [history, setHistory] = useState<string[]>(['🌽', '🍅', '🥦', '🌶️', '🥕', '🍤', '🐔', '🌽']);

  const betsRef = useRef<Record<string, number>>({});
  
  useEffect(() => {
    betsRef.current = bets;
  }, [bets]);

  const items = [
    { name: 'corn', emoji: '🌽', multiplier: '5x', weight: 18 },
    { name: 'tomato', emoji: '🍅', multiplier: '5x', weight: 18 },
    { name: 'broccoli', emoji: '🥦', multiplier: '5x', weight: 18 },
    { name: 'pepper', emoji: '🌶️', multiplier: '5x', weight: 18 },
    { name: 'fish', emoji: '🐟', multiplier: '25x', weight: 5 },
    { name: 'carrot', emoji: '🥕', multiplier: '5x', weight: 18 },
    { name: 'shrimp', emoji: '🍤', multiplier: '10x', weight: 10 },
    { name: 'chicken', emoji: '🐔', multiplier: '45x', weight: 2 },
  ];

  // Game Loop Logic synchronized with backend
  useEffect(() => {
    let active = true;
    const fetchState = async () => {
      try {
        const res = await fetch('/api/veggie-game/state');
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;

        if (data.history) {
          setHistory(data.history);
        }

        if (data.gameState === 'betting') {
          setGameState('betting');
          setTimeLeft(data.timeLeft);
          setWinningPulse(null);
          setWinAmount(0);
        } else if (data.gameState === 'spinning' && gameState === 'betting') {
          setGameState('spinning');
          setTimeLeft(data.timeLeft);
          if (data.winnerIdx !== null) {
            triggerClientSpin(data.winnerIdx);
          }
        }
      } catch (err) {
        console.error("Error fetching veggie game state:", err);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [gameState]);

  const triggerClientSpin = (winnerIdx: number) => {
    // 2. Calculate rotation
    const extraSpins = 5;
    const itemAngle = winnerIdx * 45;
    
    setRotation(prev => {
      const targetRotation = prev + (360 * extraSpins) - (itemAngle % 360) - (prev % 360);
      return targetRotation;
    });

    // 3. Reveal result after animation
    const spinDuration = 4000;
    setTimeout(() => {
      setWinningPulse(winnerIdx);
      
      const winnerItem = items[winnerIdx];
      const currentBet = betsRef.current[winnerItem.name] || 0;
      if (currentBet > 0) {
        const mult = parseInt(winnerItem.multiplier.replace('x', ''));
        const payout = currentBet * mult;
        setWinAmount(payout);
        setCoins(prev => prev + payout);
      }

      setGameState('result');
      setTimeout(() => {
        setGameState('betting');
        setBets({});
        setWinningPulse(null);
        setWinAmount(0);
        setTimeLeft(19);
      }, 4000);
    }, spinDuration);
  };

  const handlePlaceBet = (itemName: string) => {
    if (gameState !== 'betting') return;
    
    // Rule: Limit to 6 unique items per round
    const uniqueBets = Object.keys(bets);
    if (!bets[itemName] && uniqueBets.length >= 6) {
      return; // Cannot bet on a 7th item
    }

    if (coins >= selectedBet) {
      setCoins(prev => prev - selectedBet);
      setBets(prev => ({
        ...prev,
        [itemName]: (prev[itemName] || 0) + selectedBet
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[300] bg-[#4B2291] flex flex-col max-w-md mx-auto overflow-y-auto no-scrollbar text-white pb-16"
      dir="rtl"
    >
      {/* Game Background - Dark starry night with castle/theme park vibe */}
      <div className="absolute inset-0 bg-[#4B2291]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D0F5E] via-[#4B2291] to-[#7B3FE4] opacity-80"></div>
        {/* Stars */}
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/40 animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
        {/* Simplified Theme park bg elements */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Top Controls */}
      <header className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button className="w-9 h-9 bg-indigo-900/40 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg">
              <Menu size={18} />
            </button>
            <button className="w-9 h-9 bg-indigo-900/40 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg">
              <History size={18} />
            </button>
            <button className="w-9 h-9 bg-indigo-900/40 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg">
              <Settings size={18} />
            </button>
            <button className="w-9 h-9 bg-indigo-900/40 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg">
              <Trophy size={18} />
            </button>
        </div>
        
        <button 
          onClick={onClose}
          className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md hover:bg-white/20 transition-colors shadow-lg"
        >
          <ChevronLeft size={22} className="rotate-180" />
        </button>
      </header>

      {/* Main Game Stage */}
      <main className="relative flex-1 flex flex-col items-center">
        {/* Side Balance Overlay (Requested) */}
        <div className="absolute left-0 top-[20%] z-40 bg-black/60 backdrop-blur-md rounded-r-2xl border-l-[3px] border-amber-400 p-3 shadow-2xl flex flex-col items-center gap-2 group hover:scale-105 transition-transform duration-300">
           <div className="bg-amber-400/20 p-2 rounded-full border border-amber-400/30">
              <Coins size={20} className="text-amber-400 animate-pulse" />
           </div>
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-tighter">رصيدك</span>
              <span className="text-lg font-black text-white italic drop-shadow-sm" id="user-balance">
                 {coins.toLocaleString()}
              </span>
           </div>
        </div>

        {/* Mascot & Title Top */}
        <div className="relative mt-2 flex flex-col items-center z-10">
           <div className="relative group">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3233/3233488.png" 
                className="w-28 h-28 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] relative hover:scale-110 transition-transform duration-300" 
                alt="Lucky Cat Mascot"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#8B4513] px-6 py-1 rounded-full text-[14px] font-black border-2 border-white shadow-xl whitespace-nowrap uppercase tracking-wider">
                قطة الحظ
              </div>
              {/* Optional: Add some floating coins around it with CSS */}
              <div className="absolute -top-4 -right-4 text-2xl animate-bounce">💰</div>
              <div className="absolute -top-2 -left-4 text-xl animate-bounce delay-100">✨</div>
           </div>
        </div>

        {/* Lucky Box Info (Top Right Float) */}
        <div className="absolute top-12 right-4 z-20 flex flex-col items-end">
           <div className="bg-[#FF8C00] px-4 py-1 rounded-full border-2 border-white shadow-xl flex items-center gap-2">
              <span className="text-[12px] font-black text-white">صندوق الحظ 65889040</span>
           </div>
        </div>

        {/* The Lucky Wheel Wheel */}
        <div className="relative w-full aspect-square flex items-center justify-center -mt-16 sm:-mt-20 scale-[0.85] sm:scale-100 mb-4 wheel-container">
           
           {/* Pointer at top center */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] z-[60] text-amber-400 text-6xl filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.6)] animate-bounce pointer">▼</div>

           {/* Rotating Wheel Container */}
           <motion.div 
              animate={{ rotate: rotation }}
              transition={{ duration: gameState === 'spinning' ? 4 : 0, ease: [0.15, 0, 0.15, 1] }}
              style={{ willChange: 'transform' }}
              className="relative w-[280px] h-[280px] rounded-full border-[10px] border-[#4a0080] shadow-[0_0_60px_rgba(74,0,128,0.5)] bg-[#1a0033] overflow-hidden wheel"
              id="mainWheel"
           >
              {/* Decorative radial lines */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-white/10 origin-bottom"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                />
              ))}

              {/* Wheel Items Cards */}
              {items.map((item, index) => {
                const angle = (index * 45); 
                const radius = 105;
                const isWinner = winningPulse === index;

                return (
                  <div
                    key={item.name}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div 
                      className="relative flex flex-col items-center pointer-events-auto cursor-pointer slot"
                      style={{ transform: `translateY(-${radius}px)`, '--i': index + 1 } as any}
                      onClick={(e) => { e.stopPropagation(); handlePlaceBet(item.name); }}
                    >
                       <motion.div
                          animate={isWinner ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                          transition={{ repeat: isWinner ? Infinity : 0, duration: 0.5 }}
                          className="flex flex-col items-center"
                       >
                          <div className={`w-14 h-18 bg-[#FFF9E6] rounded-xl border-[3px] shadow-sm flex flex-col items-center justify-center p-2 transition-colors ${isWinner ? 'border-amber-400' : 'border-amber-600/20'}`}>
                             <div className="text-3xl">{item.emoji}</div>
                          </div>
                          <div className="absolute -bottom-2 bg-[#FF5500] px-2 py-0.25 rounded-lg border border-white shadow-sm z-10 min-w-[30px] text-center">
                             <span className="text-[10px] font-black text-white italic">{item.multiplier}</span>
                          </div>

                          {/* Current Bet Badge */}
                          {bets[item.name] > 0 && (
                            <div className="absolute -top-3 -right-3 bg-[#FF0080] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md z-20">
                               {bets[item.name] >= 1000 ? `${(bets[item.name]/1000).toFixed(1)}k` : bets[item.name]}
                            </div>
                          )}
                       </motion.div>
                    </div>
                  </div>
                );
              })}
           </motion.div>

           {/* Center Mascot & Timer */}
           <div className="absolute z-20 w-32 h-32 rounded-full flex flex-col items-center justify-center bg-[#1a0033]/90 border-4 border-[#4a0080] shadow-2xl overflow-hidden pointer-events-none">
              <div className="z-10 flex flex-col items-center">
                <div className="text-4xl mb-0.5">🐱</div>
                <span className="text-[10px] font-black text-white/90 uppercase">وقت الموفيت</span>
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-black text-white drop-shadow-md">
                    {gameState === 'betting' ? timeLeft : '🎲'}
                  </span>
                  <span className="text-[12px] font-black text-amber-300 mt-1">ثانية</span>
                </div>
              </div>
           </div>

           {/* Result Overlay */}
           <AnimatePresence>
              {gameState === 'result' && winningPulse !== null && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                 >
                    <div className="bg-black/60 backdrop-blur-md rounded-3xl p-6 border-4 border-amber-400 shadow-[0_0_100px_rgba(255,215,0,0.5)] flex flex-col items-center gap-2">
                       <span className="text-amber-400 font-black text-lg uppercase tracking-widest">الفائز!</span>
                       <div className="flex items-center justify-center gap-4 py-2">
                          {winAmount > 0 && (
                            <div className="w-14 h-14 rounded-full border-2 border-emerald-400 overflow-hidden shadow-lg bg-black shrink-0">
                               <img src={userAvatar} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {winAmount > 0 && <span className="text-2xl animate-pulse">✨</span>}
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl shadow-lg border-2 border-amber-400 animate-bounce shrink-0">
                             {items[winningPulse].emoji}
                          </div>
                       </div>
                       <div className="bg-amber-400 text-black px-4 py-1 rounded-full font-black text-xl">
                          {items[winningPulse].multiplier}
                       </div>
                       {winAmount > 0 && (
                          <motion.div 
                             initial={{ y: 20 }}
                             animate={{ y: [20, -5, 0] }}
                             className="text-green-400 text-3xl font-black italic drop-shadow-md mt-2"
                          >
                             +{winAmount.toLocaleString()} 💰
                          </motion.div>
                       )}
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>

      {/* Betting UI (Bottom Section) */}
      <footer className="relative z-10 bg-[#4B2291] p-4 pb-8 space-y-4">
         {/* Jackpot Counter - Brown styled area as in screenshot */}
         <div className="flex justify-center -mt-24 mb-4 relative z-20">
            <div className="relative bg-[#5C2E0A] p-2 rounded-2xl border-4 border-[#8B4513] shadow-[0_20px_40px_rgba(0,0,0,0.6)] min-w-[280px]">
               <div className="flex items-center justify-center gap-1.5 h-16 bg-black/60 rounded-xl text-5xl font-black text-[#FFD700] italic tracking-[4px] shadow-inner">
                  021590
               </div>
               
               {/* Decorative Crown */}
               <div className="absolute -top-10 -right-4 text-5xl filter drop-shadow-lg">👑</div>
               {/* TOP 1 Badge */}
               <div className="absolute -top-4 -left-8 w-20 h-20 bg-gradient-to-b from-amber-200 to-orange-500 rounded-full border-4 border-white flex flex-col items-center justify-center shadow-2xl z-10">
                 <span className="text-[10px] font-black text-black leading-none">المركز</span>
                 <span className="text-[14px] font-black text-black leading-none">الأول</span>
               </div>
            </div>
         </div>

          {/* Results Banner - Warm brownish color */}
          <div className="relative mx-1">
             <div className="bg-[#8B4513]/80 rounded-full h-14 flex items-center justify-between px-6 border-y-2 border-amber-600/40 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                   {history.map((res, i) => (
                     <motion.div 
                       initial={{ scale: 0, x: -10 }}
                       animate={{ scale: 1, x: 0 }}
                       key={i} 
                       className="flex-shrink-0 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-sm shadow-inner border border-white/5 font-black animate-pulse"
                     >
                       {res}
                     </motion.div>
                   ))}
                </div>
                <span className="text-[14px] font-black text-white/90 shrink-0">الوثائق:</span>
             </div>
          </div>

         {/* Animal Selection Grid for Betting */}
         <div className="px-2">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">اختر الرمز</span>
                 <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">(بحد أقصى 6 رموز)</span>
               </div>
               <div className="h-px flex-1 bg-white/5 mx-3"></div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
               {items.map((item) => (
               <button 
                  key={item.name}
                  onClick={() => handlePlaceBet(item.name)}
                  className={`relative bg-white/10 border-2 rounded-2xl p-2.5 flex flex-col items-center gap-1 transition-all active:scale-95 hover:bg-white/15 ${bets[item.name] > 0 ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-white/10 opacity-90'}`}
               >
                  <div className="text-4xl filter drop-shadow-md">{item.emoji}</div>
                  <div className="text-[10px] font-black text-white italic">{item.multiplier}</div>
                  
                  {/* Current Bet Count Badge */}
                  {bets[item.name] > 0 && (
                     <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-xl z-20">
                        {bets[item.name] >= 1000 ? `${(bets[item.name]/1000).toFixed(1)}k` : bets[item.name]}
                     </div>
                  )}

                  {/* Bet Progress Indicator (Mini) */}
                  {bets[item.name] > 0 && (
                     <div className="absolute inset-0 bg-amber-400/5 rounded-2xl pointer-events-none border border-amber-400/20"></div>
                  )}
               </button>
               ))}
            </div>
         </div>

         {/* Betting Chips */}
         <div className="grid grid-cols-5 gap-2 px-1 py-2">
            {[
              { amount: 200, label: '200', bg: 'bg-[#FFD933]' },
              { amount: 2000, label: '2000', bg: 'bg-[#33CC99]' },
              { amount: 10000, label: '10000', bg: 'bg-[#4D94FF]' },
              { amount: 100000, label: '100 ألف', bg: 'bg-[#FF3399]' },
              { amount: 200000, label: '200 ألف', bg: 'bg-[#FF3333]' },
            ].map((chip) => (
              <button 
                key={chip.label} 
                onClick={() => setSelectedBet(chip.amount)}
                className={`flex flex-col items-center justify-center gap-3 h-28 rounded-[24px] border-b-[6px] border-black/30 transition-all ${selectedBet === chip.amount ? 'scale-105 -translate-y-2 brightness-110 shadow-[0_10px_20px_rgba(0,0,0,0.4)]' : 'hover:scale-105 shadow-xl'} ${chip.bg}`}
              >
                <div className="text-3xl text-black">🕶️</div>
                <span className="text-[14px] font-black text-black/80">{chip.label}</span>
                {selectedBet === chip.amount && <div className="absolute inset-0 border-4 border-white/60 rounded-[24px] pointer-events-none"></div>}
              </button>
            ))}
         </div>

         {/* Footer User Info Bar */}
         <div className="bg-[#3D1E7B] rounded-3xl mt-4 mx-1 p-4 flex items-center justify-between shadow-2xl border border-white/5">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden shadow-lg bg-orange-200">
                      <img src={userAvatar} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-amber-400">الربح:</span>
                      <span className={`text-2xl font-black italic transition-all ${winAmount > 0 ? 'text-green-400 scale-110' : 'text-white'}`}>
                        {winAmount > 0 ? winAmount.toLocaleString() : '0'}
                      </span>
                   </div>
                </div>
                {/* Add Balance Button */}
                <button 
                  onClick={() => setShowRecharge(true)}
                  className="bg-amber-500 p-1.5 rounded-full border border-white shadow-lg active:scale-90 transition-transform"
                >
                  <Plus size={16} className="text-black" />
                </button>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-black/20 rounded-full px-3 py-1.5 gap-2 border border-white/5">
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-[#4B2291] bg-gray-500 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=p${i}`} className="w-full h-full object-cover" />
                       </div>
                     ))}
                  </div>
                  <span className="text-[11px] font-black text-white/80">TOP 5</span>
               </div>
               <span className="text-[11px] font-black text-white/40 uppercase tracking-tighter">لاعبون</span>
            </div>
         </div>
      </footer>
    </motion.div>
  );
}

function BetItem({ emoji, amount }: { emoji: string, amount: number }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 group">
       <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center text-5xl hover:bg-white/10 transition-all cursor-pointer border border-white/5 group-hover:border-amber-500/30 group-hover:scale-110">
         {emoji}
       </div>
       <div className="flex flex-col items-center">
         <span className="text-amber-500 font-black text-lg tracking-widest">{amount}</span>
         <span className="text-gray-500 text-[10px] font-bold">كوينز</span>
       </div>
       <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black border border-white/5 transition-all">
         رهان
       </button>
    </div>
  );
}

