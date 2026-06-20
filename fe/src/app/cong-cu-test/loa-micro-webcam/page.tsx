"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Video, Volume2, ArrowLeft, Play, Square, AlertCircle, Camera, Circle, Headphones, Zap, Info, Download, RefreshCw, Activity } from "lucide-react";
import Link from "next/link";

export default function AudioVideoTestPage() {
  // --- WEBCAM STATE ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const micCanvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [cameraInfo, setCameraInfo] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  // --- MIC STATE ---
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [micError, setMicError] = useState<string>("");
  const [micInfo, setMicInfo] = useState<any>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafIdRef = useRef<number>(0);

  // --- SPEAKER STATE ---
  const [activeChannel, setActiveChannel] = useState<"none" | "left" | "right" | "both">("none");
  const speakerAudioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);

  // ==========================================
  // WEBCAM LOGIC
  // ==========================================
  const startCamera = async () => {
    try {
      setCameraError("");
      setPhotoUrl("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const track = stream.getVideoTracks()[0];
      if (track) {
        const settings = track.getSettings();
        setCameraInfo({
          name: track.label || "Webcam mặc định",
          resolution: settings.width && settings.height ? `${settings.width} x ${settings.height}` : "Không xác định",
          frameRate: settings.frameRate ? `${Math.round(settings.frameRate)} FPS` : "Không xác định",
          aspectRatio: settings.aspectRatio ? settings.aspectRatio.toFixed(2) : "Không xác định",
          facingMode: settings.facingMode === "user" ? "Camera trước" : settings.facingMode === "environment" ? "Camera sau" : "Không xác định"
        });
      }
    } catch (err: any) {
      let errMsg = err.message || "Không thể truy cập Webcam.";
      if (err.name === "NotAllowedError" || errMsg.toLowerCase().includes("permission denied")) {
        errMsg = "Trình duyệt đang chặn quyền. Vui lòng cho phép truy cập Camera để tiếp tục.";
      } else if (err.name === "NotFoundError" || errMsg.toLowerCase().includes("requested device not found")) {
        errMsg = "Không tìm thấy Camera nào được kết nối với thiết bị này.";
      } else if (err.name === "NotReadableError" || errMsg.toLowerCase().includes("could not start video source")) {
        errMsg = "Camera đang bị ứng dụng khác sử dụng. Vui lòng tắt ứng dụng đó và thử lại.";
      }
      setCameraError(errMsg);
      setCameraInfo(null);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror to match video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhotoUrl(canvas.toDataURL("image/png"));
      }
    }
  };

  // ==========================================
  // MICROPHONE LOGIC
  // ==========================================
  const startMic = async () => {
    try {
      setMicError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      const track = stream.getAudioTracks()[0];
      if (track) {
        const settings = track.getSettings();
        setMicInfo({
          name: track.label || "Microphone mặc định",
          channelCount: settings.channelCount || 1,
          sampleRate: settings.sampleRate ? `${settings.sampleRate} Hz` : "Không xác định",
          echoCancellation: settings.echoCancellation ? "Có" : "Không",
          noiseSuppression: settings.noiseSuppression ? "Có" : "Không",
          autoGainControl: settings.autoGainControl ? "Có" : "Không"
        });
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setVolumeLevel(sum / dataArray.length);

        if (micCanvasRef.current) {
          const canvas = micCanvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const bufferLength = dataArray.length;
            // Draw only first 70% of frequencies (higher ones are usually empty for voice)
            const drawLength = Math.floor(bufferLength * 0.7);
            const barWidth = (width / drawLength) - 1; 
            let x = 0;

            for (let i = 0; i < drawLength; i++) {
              const barHeight = (dataArray[i] / 255) * height;
              // Map colors: Red (0) -> Yellow (60) -> Green (120) -> Blue (240)
              const h = (i / drawLength) * 240;
              ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
              ctx.beginPath();
              ctx.roundRect(x, height - barHeight, barWidth, barHeight, [2, 2, 0, 0]);
              ctx.fill();
              
              x += barWidth + 1;
            }
          }
        }

        rafIdRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err: any) {
      let errMsg = err.message || "Không thể truy cập Micro.";
      if (err.name === "NotAllowedError" || errMsg.toLowerCase().includes("permission denied")) {
        errMsg = "Trình duyệt đang chặn quyền. Vui lòng cho phép truy cập Micro để tiếp tục.";
      } else if (err.name === "NotFoundError" || errMsg.toLowerCase().includes("requested device not found")) {
        errMsg = "Không tìm thấy Micro nào được kết nối với thiết bị này.";
      } else if (err.name === "NotReadableError" || errMsg.toLowerCase().includes("could not start audio source")) {
        errMsg = "Micro đang bị ứng dụng khác sử dụng. Vui lòng tắt ứng dụng đó và thử lại.";
      }
      setMicError(errMsg);
      setMicInfo(null);
    }
  };

  const stopMic = () => {
    if (isRecording) stopRecording();
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      setMicStream(null);
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try { audioContextRef.current.close(); } catch (e) {}
    }
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    setVolumeLevel(0);
  };

  const toggleRecording = () => {
    if (!micStream) return;

    if (isRecording) {
      stopRecording();
    } else {
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(micStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordingUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingUrl("");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // ==========================================
  // SPEAKER LOGIC
  // ==========================================
  const playStereo = (channel: "left" | "right" | "both") => {
    if (activeChannel !== "none") stopStereo();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    speakerAudioCtxRef.current = ctx;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);

    const panner = ctx.createStereoPanner();
    if (channel === "left") panner.pan.value = -1;
    else if (channel === "right") panner.pan.value = 1;
    else panner.pan.value = 0;

    osc.connect(panner);
    panner.connect(ctx.destination);
    
    osc.start();
    oscillatorRef.current = osc;
    pannerRef.current = panner;
    setActiveChannel(channel);
  };

  const stopStereo = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (speakerAudioCtxRef.current && speakerAudioCtxRef.current.state !== "closed") {
      try { speakerAudioCtxRef.current.close(); } catch (e) {}
    }
    setActiveChannel("none");
  };

  // Sync stream to video element when it renders
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      stopMic();
      stopStereo();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/100 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-primary rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-[1400px] py-12 relative z-10">
        
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 text-sm font-bold tracking-widest uppercase">
            <ArrowLeft size={16} className="mr-2" /> Trở về
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap size={24} className="text-primary" />
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                TEST <span className="text-primary">THIẾT BỊ NGOẠI VI</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">

          {/* ================= WEBCAM SECTION ================= */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl flex flex-col xl:flex-row gap-8">
            {/* Viewer */}
            <div className="flex-[5] flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/100/20 flex items-center justify-center">
                  <Video size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-wider text-white">Khu Vực Test Webcam</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hiển thị thời gian thực</p>
                </div>
              </div>

              <div className="bg-black/60 rounded-2xl overflow-hidden min-h-[400px] xl:min-h-[500px] border border-white/5 shadow-inner relative flex items-center justify-center">
                {!cameraStream ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Camera size={64} className="text-white/10 mb-6" />
                    <button onClick={startCamera} className="bg-primary hover:bg-primary/100 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-1">
                      <Video size={20} /> Kiểm tra Webcam của tôi
                    </button>
                    {cameraError && <p className="text-primary text-sm mt-6 flex items-center justify-center gap-2 bg-primary/100/10 px-4 py-2 rounded-lg border border-primary/50"><AlertCircle size={16}/> {cameraError}</p>}
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover absolute inset-0"
                      style={{ transform: "scaleX(-1)" }} 
                    />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 border border-primary/50">
                      <div className="w-2 h-2 rounded-full bg-primary/100 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div> Đang ghi hình
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info & Actions */}
            <div className="flex-[3] flex flex-col gap-6">
              <div className="bg-[#11141a] rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info size={18} className="text-gray-400" /> Thông tin Webcam
                </h3>
                
                {cameraInfo ? (
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tên thiết bị</td>
                        <td className="py-3 text-right font-bold text-white">{cameraInfo.name}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Độ phân giải</td>
                        <td className="py-3 text-right font-bold text-white">{cameraInfo.resolution}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tốc độ khung hình</td>
                        <td className="py-3 text-right font-bold text-white">{cameraInfo.frameRate}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tỷ lệ khung hình</td>
                        <td className="py-3 text-right font-bold text-white">{cameraInfo.aspectRatio}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500 font-medium">Vị trí Camera</td>
                        <td className="py-3 text-right font-bold text-white">{cameraInfo.facingMode}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-600 font-medium text-sm">
                    Thông tin sẽ hiển thị khi bạn bật Webcam
                  </div>
                )}
              </div>

              {cameraStream && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={takePhoto} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                      <Camera size={18} /> Chụp ảnh
                    </button>
                    <button onClick={stopCamera} className="bg-white/5 hover:bg-primary/100/10 border border-white/10 hover:border-primary/50 text-white hover:text-primary p-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                      <Square size={18} /> Dừng Camera
                    </button>
                  </div>
                  
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {photoUrl && (
                    <div className="mt-2 relative rounded-xl border border-white/10 overflow-hidden bg-black/50 p-2">
                      <img src={photoUrl} alt="Snapshot" className="w-full rounded-lg" />
                      <a href={photoUrl} download="webcam-snapshot.png" className="absolute bottom-4 right-4 bg-primary hover:bg-primary/100 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                        <Download size={14} /> Tải Xuống
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ================= MICROPHONE SECTION ================= */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl flex flex-col xl:flex-row gap-8">
            
            {/* Mic Viewer */}
            <div className="flex-[5] flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Mic size={20} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-wider text-white">Khu Vực Test Micro</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Phân tích cường độ âm thanh</p>
                </div>
              </div>

              <div className="bg-black/60 rounded-2xl overflow-hidden min-h-[300px] border border-white/5 shadow-inner relative flex flex-col items-center justify-center p-8">
                {!micStream ? (
                  <div className="flex flex-col items-center text-center">
                    <Mic size={64} className="text-white/10 mb-6" />
                    <button onClick={startMic} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1">
                      <Mic size={20} /> Kiểm tra Micro của tôi
                    </button>
                    {micError && <p className="text-primary text-sm mt-6 flex items-center justify-center gap-2 bg-primary/100/10 px-4 py-2 rounded-lg border border-primary/50"><AlertCircle size={16}/> {micError}</p>}
                  </div>
                ) : (
                  <div className="w-full max-w-2xl flex flex-col items-center gap-8 w-full">
                    
                    <div className="w-full">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Biểu đồ tần số âm thanh</span>
                        <span className="text-xl font-black text-white">{Math.round((volumeLevel / 128) * 100)}%</span>
                      </div>
                      <div className="w-full h-32 bg-[#050505] rounded-2xl overflow-hidden border border-white/10 shadow-inner relative flex items-end justify-center p-2">
                        <canvas ref={micCanvasRef} width={600} height={120} className="w-full h-full" />
                      </div>
                    </div>

                    <div className="flex gap-4 w-full">
                      <button 
                        onClick={toggleRecording} 
                        className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 border ${
                          isRecording ? "bg-primary border-primary/50 text-primary shadow-[0_0_30px_rgba(220,38,38,0.2)] animate-pulse" : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        }`}
                      >
                        {isRecording ? <Square size={18} /> : <Circle size={18} fill="currentColor" />} 
                        {isRecording ? "Dừng Ghi Âm" : "Bắt Đầu Ghi Âm"}
                      </button>
                      
                      <button onClick={stopMic} className="px-6 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-primary/100/10 hover:text-primary transition-all text-gray-300">
                        <RefreshCw size={18} /> Tắt Mic
                      </button>
                    </div>

                    {recordingUrl && (
                      <div className="w-full bg-[#111] p-4 rounded-xl border border-white/10 mt-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Bản ghi gần nhất</p>
                        <audio src={recordingUrl} controls className="w-full h-12 custom-audio" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mic Info */}
            <div className="flex-[3] flex flex-col gap-6">
              <div className="bg-[#11141a] rounded-2xl p-6 border border-white/5 flex-1">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-gray-400" /> Thông tin Micro
                </h3>
                
                {micInfo ? (
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tên thiết bị</td>
                        <td className="py-3 text-right font-bold text-white max-w-[200px] truncate" title={micInfo.name}>{micInfo.name}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Sample Rate</td>
                        <td className="py-3 text-right font-bold text-white">{micInfo.sampleRate}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Số Kênh (Channels)</td>
                        <td className="py-3 text-right font-bold text-white">{micInfo.channelCount}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Lọc tiếng vang</td>
                        <td className="py-3 text-right font-bold text-green-400">{micInfo.echoCancellation}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Giảm tiếng ồn</td>
                        <td className="py-3 text-right font-bold text-green-400">{micInfo.noiseSuppression}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500 font-medium">Tự động khuếch đại</td>
                        <td className="py-3 text-right font-bold text-green-400">{micInfo.autoGainControl}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-600 font-medium text-sm">
                    Thông tin sẽ hiển thị khi bạn bật Micro
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= SPEAKER SECTION ================= */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Headphones size={20} className="text-pink-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider text-white">Kiểm tra Loa / Tai nghe</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Test tách kênh Stereo Trái/Phải</p>
              </div>
            </div>

            <div className="bg-black/60 rounded-2xl p-8 border border-white/5 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <button
                  onClick={() => activeChannel === "left" ? stopStereo() : playStereo("left")}
                  className={`py-8 rounded-2xl font-bold flex flex-col items-center justify-center gap-4 transition-all duration-300 border ${
                    activeChannel === "left" ? "bg-primary border-primary/50 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-[1.02]" : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {activeChannel === "left" ? <Volume2 size={40} className="animate-pulse" /> : <Volume2 size={40} />}
                  <div className="text-center">
                    <span className="block text-xl uppercase tracking-widest font-black mb-1">Loa Trái</span>
                    <span className="text-xs font-medium opacity-70">Left Channel (L)</span>
                  </div>
                </button>

                <button
                  onClick={() => activeChannel === "right" ? stopStereo() : playStereo("right")}
                  className={`py-8 rounded-2xl font-bold flex flex-col items-center justify-center gap-4 transition-all duration-300 border ${
                    activeChannel === "right" ? "bg-primary border-primary/50 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-[1.02]" : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {activeChannel === "right" ? <Volume2 size={40} className="animate-pulse" /> : <Volume2 size={40} />}
                  <div className="text-center">
                    <span className="block text-xl uppercase tracking-widest font-black mb-1">Loa Phải</span>
                    <span className="text-xs font-medium opacity-70">Right Channel (R)</span>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => activeChannel === "both" ? stopStereo() : playStereo("both")}
                  className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 uppercase tracking-widest text-sm border ${
                    activeChannel === "both" ? "bg-white/20 border-white/40 text-white" : "bg-transparent border-white/20 hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  {activeChannel === "both" ? <Square size={18} /> : <Play size={18} />} 
                  {activeChannel === "both" ? "Dừng Phát" : "Phát Cả 2 Kênh Âm Thanh"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style jsx global>{`
        .custom-audio::-webkit-media-controls-panel {
          background-color: #1a1a1a;
        }
        .custom-audio::-webkit-media-controls-current-time-display,
        .custom-audio::-webkit-media-controls-time-remaining-display {
          color: white;
        }
      `}</style>
    </div>
  );
}
