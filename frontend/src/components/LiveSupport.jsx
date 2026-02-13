import { useEffect, useCallback, useState } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";
import { useChatStore } from "../stores";

const LiveSupport = () => {
  const { isLoaded, setLoaded, hasAutoOpened, setAutoOpened } = useChatStore();
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  // Smartsupp initialization
  const initSmartsupp = useCallback(() => {
    if (window._smartsupp || isLoaded) return;

    setIsInitializing(true);

    // Smartsupp configuration
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = "9f40ed644a4b74b5b3481aa3dfd33590a65b6bea";
    window._smartsupp.offsetY = 20;
    window._smartsupp.cookieDomain = window.location.hostname;

    // Create and inject script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.charset = "utf-8";
    script.src = "https://www.smartsuppchat.com/loader.js?";
    document.head.appendChild(script);

    script.onload = () => {
      // Wait for Smartsupp to be fully initialized
      const checkReady = setInterval(() => {
        if (window.smartsupp) {
          clearInterval(checkReady);
          setLoaded(true);
          setIsInitializing(false);

          // Hide default widget, we use custom button
          window.smartsupp("chat:hide");

          // Auto-open on first visit
          if (!hasAutoOpened) {
            setTimeout(() => {
              setIsWidgetVisible(true);
              window.smartsupp("chat:show");
              window.smartsupp("chat:open");
              setAutoOpened(true);
            }, 3000);
          }
        }
      }, 100);

      // Timeout fallback
      setTimeout(() => {
        clearInterval(checkReady);
        setIsInitializing(false);
      }, 10000);
    };

    script.onerror = () => {
      setIsInitializing(false);
      console.error("Failed to load Smartsupp");
    };
  }, [isLoaded, hasAutoOpened, setLoaded, setAutoOpened]);

  useEffect(() => {
    // Initialize on mount
    initSmartsupp();

    // Cleanup
    return () => {
      if (window.smartsupp) {
        window.smartsupp("chat:hide");
      }
    };
  }, [initSmartsupp]);

  // Toggle chat visibility
  const toggleChat = () => {
    if (!isLoaded) {
      initSmartsupp();
      return;
    }

    if (window.smartsupp) {
      if (isWidgetVisible) {
        window.smartsupp("chat:hide");
        window.smartsupp("chat:close");
        setIsWidgetVisible(false);
      } else {
        window.smartsupp("chat:show");
        window.smartsupp("chat:open");
        setIsWidgetVisible(true);
      }
    }
  };

  // Close chat
  const closeChat = () => {
    if (window.smartsupp) {
      window.smartsupp("chat:hide");
      window.smartsupp("chat:close");
    }
    setIsWidgetVisible(false);
  };

  // Handle chat events
  useEffect(() => {
    if (!isLoaded || !window.smartsupp) return;

    // Listen for chat close
    window.smartsupp("on", "widget:close", () => {
      setIsWidgetVisible(false);
      window.smartsupp("chat:hide");
    });

    // Listen for chat open
    window.smartsupp("on", "widget:open", () => {
      setIsWidgetVisible(true);
    });
  }, [isLoaded]);

  // Calculate button position (above Smartsupp widget when visible)
  const buttonBottom = isWidgetVisible ? "calc(100vh - 120px)" : "24px";

  return (
    <>
      {/* Floating Live Support Button */}
      {showBubble && (
        <button
          onClick={toggleChat}
          disabled={isInitializing}
          className={`
            fixed bottom-6 right-6 z-[9998]
            flex items-center gap-2
            bg-gradient-to-r from-ocean to-ocean-dark
            text-white
            px-5 py-3
            rounded-full
            shadow-lg shadow-ocean/25
            transition-all duration-300 ease-out
            hover:shadow-xl hover:shadow-ocean/30
            hover:scale-105
            hover:from-ocean-dark hover:to-ocean
            active:scale-95
            group
            ${isInitializing ? "cursor-wait opacity-80" : "cursor-pointer"}
          `}
          style={{ bottom: buttonBottom }}
          aria-label={isWidgetVisible ? "Close chat" : "Open live chat support"}
        >
          {/* Animated icon */}
          {isInitializing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isWidgetVisible ? (
            <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
          ) : (
            <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />
          )}

          {/* Button text */}
          <span className="font-medium text-sm tracking-wide">
            {isWidgetVisible ? "Close Chat" : "Live Support"}
          </span>

          {/* Pulse animation indicator - shows chat is available */}
          {!isWidgetVisible && !isInitializing && (
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </button>
      )}

      {/* Welcome message bubble - shows once */}
      {!hasAutoOpened && !isWidgetVisible && showBubble && (
        <div
          className="fixed right-6 bottom-20 z-[9997]
                      max-w-xs p-4 rounded-2xl rounded-br-md
                      bg-white shadow-xl border border-sand-200
                      animate-fade-in"
        >
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full 
                       bg-charcoal/10 hover:bg-charcoal/20 
                       flex items-center justify-center
                       transition-colors"
          >
            <X className="w-3 h-3 text-charcoal" />
          </button>
          <p className="text-sm text-charcoal">
            <span className="font-semibold">Welcome to Fatwave! 🏄</span>
            <br />
            <span className="text-charcoal/70">
              Have questions about your booking? We're here to help!
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default LiveSupport;
