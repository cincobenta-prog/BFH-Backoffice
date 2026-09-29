import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Delete, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Fingerprint, 
  Settings,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { loadPersistedState, savePersistedState, STORAGE_KEYS } from '../../lib/storage/persistence';

interface ManagerPinLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PINS = ['3995', '8850', '1928', '2026'];

export const ManagerPinLoginModal: React.FC<ManagerPinLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'pin' | 'biometric' | 'settings'>('pin');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Biometrics simulation
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);

  // Custom PIN from persistent storage (Default: 3995 for Jason Benta)
  const [customPin, setCustomPin] = useState<string>(() => loadPersistedState<string>(STORAGE_KEYS.MANAGER_PIN, '3995'));
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setIsShaking(false);
      setIsUnlocked(false);
      setIsScanningBiometric(false);
      setActiveTab('pin');
    }
  }, [isOpen]);

  // Keyboard support for numpad / digits
  useEffect(() => {
    if (!isOpen || activeTab !== 'pin') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, activeTab]);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);

      if (nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const validatePin = (inputPin: string) => {
    const validPins = [...DEFAULT_PINS, customPin];
    if (validPins.includes(inputPin)) {
      setIsUnlocked(true);
      setError(null);
      setTimeout(() => {
        onSuccess();
      }, 450);
    } else {
      setIsShaking(true);
      setError(`Invalid Manager PIN. Jason Benta PIN: 3995.`);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 700);
    }
  };

  const handleBiometricAuthenticate = () => {
    setIsScanningBiometric(true);
    setError(null);

    // Simulate WebAuthn / TouchID hardware prompt
    setTimeout(() => {
      setIsScanningBiometric(false);
      setIsUnlocked(true);
      setTimeout(() => {
        onSuccess();
      }, 500);
    }, 1200);
  };

  const handleSaveCustomPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length === 4 && /^\d+$/.test(newPinInput)) {
      setCustomPin(newPinInput);
      savePersistedState(STORAGE_KEYS.MANAGER_PIN, newPinInput);
      setPinChangeSuccess(true);
      setTimeout(() => {
        setPinChangeSuccess(false);
        setActiveTab('pin');
        setNewPinInput('');
      }, 1500);
    } else {
      setError('PIN must be exactly 4 numeric digits.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className={`bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Top Gold & Crimson Banner Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#991b1b] via-[#b45309] to-[#991b1b]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sub-Tabs: Keypad vs Biometrics vs Settings */}
        <div className="flex items-center justify-center gap-1.5 mb-5 bg-neutral-100 p-1 rounded-2xl max-w-xs mx-auto text-xs">
          <button
            onClick={() => { setActiveTab('pin'); setError(null); }}
            className={`flex-1 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'pin' ? 'bg-white text-[#991b1b] shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>PIN</span>
          </button>

          <button
            onClick={() => { setActiveTab('biometric'); setError(null); }}
            className={`flex-1 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'biometric' ? 'bg-white text-[#991b1b] shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-600" />
            <span>Touch / Face ID</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setError(null); }}
            className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center justify-center text-neutral-600 hover:text-neutral-900 ${
              activeTab === 'settings' ? 'bg-white text-[#991b1b] shadow-xs' : ''
            }`}
            title="Configure Security & PIN"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-200 flex items-center justify-center text-[#991b1b] shadow-inner">
            {isUnlocked ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
            ) : activeTab === 'biometric' ? (
              <Fingerprint className={`w-8 h-8 ${isScanningBiometric ? 'text-amber-600 animate-pulse' : 'text-[#991b1b]'}`} />
            ) : activeTab === 'settings' ? (
              <Sliders className="w-7 h-7 text-[#991b1b]" />
            ) : (
              <KeyRound className="w-7 h-7 text-[#991b1b]" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-[#991b1b] text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>NYS Bureau of Funeral Directing Security Gate</span>
            </div>
            <h3 className="font-serif-title font-bold text-xl text-neutral-900">
              Executive Manager Portal
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              {activeTab === 'biometric'
                ? 'Authenticate instantly with Apple Touch ID, Face ID, or Windows Hello.'
                : activeTab === 'settings'
                ? 'Change your 4-digit Manager Security PIN with local storage persistence.'
                : 'Enter Managing Director Security PIN for staff scheduling and trade payroll.'}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: NUMERIC KEYPAD                                     */}
        {/* ========================================================= */}
        {activeTab === 'pin' && (
          <>
            {/* PIN Dot Indicators */}
            <div className="flex justify-center items-center gap-3 my-5">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      isUnlocked
                        ? 'bg-emerald-500 scale-110 shadow-md shadow-emerald-400/50'
                        : isFilled
                        ? 'bg-[#991b1b] scale-110 shadow-md shadow-red-900/30'
                        : 'bg-neutral-200 border border-neutral-300'
                    }`}
                  />
                );
              })}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-[#991b1b] flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px] leading-tight">{error}</span>
              </div>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigit(digit)}
                  className="h-12 bg-neutral-50 hover:bg-neutral-100 active:bg-red-50 active:text-[#991b1b] border border-neutral-200 rounded-2xl text-lg font-bold text-neutral-800 transition shadow-xs flex items-center justify-center font-mono select-none"
                >
                  {digit}
                </button>
              ))}

              {/* Clear / Backspace / 0 */}
              <button
                type="button"
                onClick={handleClear}
                className="h-12 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 active:bg-neutral-200 border border-neutral-200 rounded-2xl text-xs font-semibold transition shadow-xs flex items-center justify-center uppercase tracking-wider select-none"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="h-12 bg-neutral-50 hover:bg-neutral-100 active:bg-red-50 active:text-[#991b1b] border border-neutral-200 rounded-2xl text-lg font-bold text-neutral-800 transition shadow-xs flex items-center justify-center font-mono select-none"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleBackspace}
                className="h-12 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 active:bg-neutral-200 border border-neutral-200 rounded-2xl transition shadow-xs flex items-center justify-center select-none"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Fast Demo Unlock Helper */}
            <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPin(customPin);
                  setIsUnlocked(true);
                  setTimeout(() => onSuccess(), 400);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-100" />
                <span>⚡ 1-Tap Demo Unlock (Jason Benta, Managing LFD)</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-light">
                <Lock className="w-3 h-3" />
                <span>Active PIN: <strong className="text-neutral-700 font-mono">{customPin}</strong> (Jason Benta: <strong className="text-[#991b1b] font-mono">3995</strong>)</span>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BIOMETRIC WEBAUTHN SENSOR (TouchID / FaceID)       */}
        {/* ========================================================= */}
        {activeTab === 'biometric' && (
          <div className="my-6 space-y-6 text-center">
            <div 
              onClick={handleBiometricAuthenticate}
              className={`w-28 h-28 mx-auto rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isScanningBiometric
                  ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/20 scale-105'
                  : isUnlocked
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20'
                  : 'border-neutral-300 hover:border-[#991b1b] bg-neutral-50 hover:bg-red-50/50 shadow-sm'
              }`}
            >
              {isUnlocked ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
              ) : (
                <Fingerprint className={`w-12 h-12 transition-transform duration-300 ${
                  isScanningBiometric ? 'text-amber-600 animate-pulse scale-110' : 'text-[#991b1b]'
                }`} />
              )}
              <span className="text-[10px] font-bold text-neutral-600 mt-1 uppercase tracking-wider font-mono">
                {isScanningBiometric ? 'Scanning...' : isUnlocked ? 'Verified' : 'Tap to Scan'}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-neutral-900">
                Touch ID / Face ID Biometric Verification
              </h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Tap sensor or button below to simulate biometric hardware authorization for <strong>Director Jason Benta (NYS LFD #08850)</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleBiometricAuthenticate}
              disabled={isScanningBiometric}
              className="w-full bg-[#991b1b] hover:bg-red-800 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md border border-amber-400/40"
            >
              {isScanningBiometric ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Verifying Biometric Credential...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4 text-amber-300" />
                  <span>Authenticate with Touch ID / Face ID</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CUSTOM PIN SETTINGS (Persistent Storage)           */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="my-6 space-y-4">
            <form onSubmit={handleSaveCustomPin} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Current Active Manager PIN:
                </label>
                <div className="p-2.5 bg-neutral-100 rounded-xl font-mono text-sm font-bold text-[#991b1b]">
                  {customPin}
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Set New 4-Digit Security PIN:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4 digits (e.g. 7700)"
                  className="w-full bg-[#fbfbfd] border border-neutral-300 rounded-xl p-2.5 text-sm font-mono text-neutral-900 focus:border-[#991b1b] outline-none"
                />
              </div>

              {pinChangeSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>New Manager PIN saved to persistent storage!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#991b1b] hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
              >
                Save New PIN
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
