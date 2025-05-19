"use client";

/**
 * Reusable audio player for application sound effects
 */
export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private audioPath: string;

  constructor(audioPath: string) {
    this.audioPath = audioPath;
  }

  /**
   * Initialize and play the audio file
   */
  play(): void {
    console.log(`Playing audio: ${this.audioPath}`);
    try {
      // Clean up any existing audio instance
      this.stop();
      
      // Create new audio instance
      this.audio = new Audio(this.audioPath);
      
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`Audio playback (${this.audioPath}) was prevented:`, error);
          // Audio might be prevented due to browser autoplay policies
        });
      }
    } catch (error) {
      console.error(`Error playing audio (${this.audioPath}):`, error);
    }
  }

  /**
   * Stop and cleanup audio resources
   */
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
  
  /**
   * Update the audio file path
   * @param newPath New path to audio file
   */
  setAudioPath(newPath: string): void {
    this.audioPath = newPath;
  }
}

/**
 * Factory function to create pre-configured audio players
 */
export function createAudioPlayer(audioPath: string): AudioPlayer {
  return new AudioPlayer(audioPath);
}

// Common audio instances that can be imported from anywhere
export const welcomeAudio = new AudioPlayer("/audio-welcome.wav");
export const selfieAudio = new AudioPlayer("/audio-selfie.wav");
export const occasionAudio = new AudioPlayer("/audio-occasion.wav");
export const recommendationAudio = new AudioPlayer("/audio-recommendation.wav");
export const cameraClickAudio = new AudioPlayer("/audio-shutter.mp3");
export const micOnAudio = new AudioPlayer("/mic-on.wav");
export const micOffAudio = new AudioPlayer("/mic-off.wav");
