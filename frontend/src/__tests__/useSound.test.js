import { renderHook } from '@testing-library/react';
import { useSound } from '../hooks/useSound';

describe('useSound Hook', () => {
  beforeEach(() => {
    window.AudioContext = jest.fn().mockReturnValue({
      createOscillator: jest.fn().mockReturnValue({
        connect: jest.fn(),
        frequency: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
        start: jest.fn(),
        stop: jest.fn(),
      }),
      createGain: jest.fn().mockReturnValue({
        connect: jest.fn(),
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
      }),
      destination: {},
      currentTime: 0,
    });
    window.webkitAudioContext = undefined;
  });

  it('should return a playClickSound function', () => {
    const { result } = renderHook(() => useSound());
    expect(typeof result.current).toBe('function');
  });

  it('should play sound when playClickSound is called', () => {
    const { result } = renderHook(() => useSound());
    result.current();
    
    expect(window.AudioContext).toHaveBeenCalled();
    const audioContext = window.AudioContext.mock.results[0].value;
    expect(audioContext.createOscillator).toHaveBeenCalled();
    expect(audioContext.createGain).toHaveBeenCalled();
  });

  it('should handle AudioContext errors gracefully', () => {
    window.AudioContext = jest.fn().mockImplementation(() => {
      throw new Error('Audio not supported');
    });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const { result } = renderHook(() => useSound());
    expect(() => result.current()).not.toThrow();
    
    expect(consoleLogSpy).toHaveBeenCalledWith('Audio play failed:', expect.any(Error));
    consoleLogSpy.mockRestore();
  });
});
