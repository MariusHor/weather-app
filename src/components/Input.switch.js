const SwitchInput = () => `
            <label for="toggleFour" class="flex cursor-pointer select-none items-center">
                <div class="relative">
                    <input type="checkbox" id="toggleFour" class="sr-only" />
                    <div class="box bg-slate-700 block h-5 w-9 rounded-full"></div>
                    <div
                        class="dot absolute left-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white transition"
                    ></div>
                </div>
            </label>
    `;

export default SwitchInput;
