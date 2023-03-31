const AddFavForm = () => `
            <form class="flex items-center gap-2" data-form="favorite">
              <button class="text-red-600 text-xl leading-none h-fit" type="button" data-btn="favorite">
                <i class="fa-solid fa-heart"></i>
              </button>
              <div class="relative w-full h-full overflow-hidden flex items-center">
                <label for="fav-input" class="w-full h-fit opacity-0 transition duration-350 ease-in-out" data-label="favorite"></label>
                <input 
                    data-input="favorite"
                    autocomplete="off"
                    id="fav-input" 
                    type="text" 
                    class="absolute top-11 opacity-0 transition duration-350 ease-in-out rounded h-full w-full outline-none text-xs text-gray-200 p-1 overlay border-solid border-2 border-sky-800"
                />
              </div>
            </form> 
    `;

export default AddFavForm;
