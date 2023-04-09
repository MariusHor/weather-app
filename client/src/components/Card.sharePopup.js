const SharePopup = () => `
        <div class="share-link-popup bg-white text-slate-800 shadow-xl transition ease-in-out opacity-0 -top-14 -right-2.5 flex gap-1 items-center w-64 rounded-md absolute p-1" data-container="popup">
            <i class="fa-solid fa-link text-sm py1 px-2.5"></i>
            <input class="w-full h-full outline-none border-none text-sm" type="text" readonly="true" data-input="popup">
            <button class="m-1 text-slate-200 py-1 rounded bg-amber-600 hover:bg-amber-500 transition ease-in-out active:scale-95" data-btn="copyUrl">
                <i class="fa-solid fa-copy text-sm py1 px-2.5"></i>
            </button>
        </div>
    `;

export default SharePopup;
