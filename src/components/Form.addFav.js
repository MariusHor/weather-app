const AddFavForm = () => `
            <form class="flex items-center gap-2 h-7" data-form="favorite">
              <button class="hover:scale-125 hover:text-red-400 transition duration-250 ease-in-out text-red-600 text-xl leading-none h-fit" type="button" data-btn="favorite">
                <i class="fa-solid fa-heart"></i>
              </button>
              <label for="fav-input" class="h-fit opacity-0 transition duration-350 ease-in-out" data-label="favorite"></label>
              <div class="reveal-input flex gap-2 hidden" data-container="favorite">
                  <input 
                      data-input="favorite"
                      autocomplete="off"
                      id="fav-input" 
                      type="text" 
                      class="rounded h-full outline-none text-xs text-gray-200 p-1 overlay border-solid border-2 border-sky-800"
                  />
                  <button type="submit">Save</button>
              </div>
            </form> 
    `;

export default AddFavForm;
