"use client";

export default function CharacterAvatar() {
    return (
        <div
            className="
        relative
        flex items-center justify-center
        animate-avatar-float
      "
        >
            <img
                src="/logo/bot.png"
                alt="FloCut chatbot"
                draggable={false}
                className="
          w-18 sm:w-20 h-auto
          select-none
          transition-transform duration-200 ease-out
          hover:scale-105
          active:scale-95
        "
            />
        </div>
    );
}
