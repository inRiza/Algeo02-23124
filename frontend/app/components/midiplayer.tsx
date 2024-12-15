import { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

interface MidiPlayerProps {
  midiUrl: string;
}

const MidiPlayer: React.FC<MidiPlayerProps> = ({ midiUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<AudioBufferSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    // Clear error after 3 seconds
    setTimeout(() => setError(null), 3000);
  };

  const playMidi = async () => {
    try {
      const response = await fetch(midiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          showError('MIDI file not found');
        } else {
          showError('Error playing MIDI file');
        }
        return;
      }
      
      if (!audioContext) {
        const newContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(newContext);
      }

      const context = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      
      if (audio) {
        stopMidi(); // Stop any currently playing audio
      }
      
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudio(null);
      };
      
      source.start(0);
      setAudio(source);
      setIsPlaying(true);
      setError(null);
      
    } catch (error) {
      console.error('Error playing MIDI:', error);
      showError('Error playing MIDI file');
      setIsPlaying(false);
    }
  };

  const stopMidi = () => {
    try {
      if (audio) {
        audio.stop();
        audio.disconnect();
      }
    } catch (error) {
      console.error('Error stopping MIDI:', error);
    } finally {
      setAudio(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => isPlaying ? stopMidi() : playMidi()}
        className="text-[#1DB954] hover:text-white transition-colors ml-2 p-2 rounded-full hover:bg-[#1DB954]/10"
        title={isPlaying ? "Stop" : "Play"}
      >
        {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
      </button>
      
      {/* Error message popup */}
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default MidiPlayer;