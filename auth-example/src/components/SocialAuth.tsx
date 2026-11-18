import google from "../assets/google.svg";
import apple from "../assets/apple.svg";
import facebook from "../assets/facebook.svg"

function SocialAuth() {
  return (
    <div className="social-auth flex gap-4 w-full items-center justify-center">
      <button
        type="button"
        className="social-login flex items-center justify-center gap-2 rounded-full border-2 border-gray-100 bg-white w-10 h-10 text-center text-sm transition-colors hover:bg-gray-100"
      >
        <img src={google} alt="" aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        className="social-login flex items-center justify-center gap-2 rounded-full border-2 border-gray-100 bg-black w-10 h-10 text-center text-sm transition-colors hover:bg-black/90"
      >
        <img src={apple} alt="" aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        className="social-login flex items-center justify-center gap-2 rounded-full border-2 border-gray-100 bg-[#0866FF] w-10 h-10 text-center text-sm transition-colors hover:bg-[#0866FF]/95"
      >
        <img src={facebook} alt="" aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

export default SocialAuth;
