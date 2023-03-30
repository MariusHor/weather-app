import homeDefaultBg from '../constants/images';

const DefaultSidebar = () => `
        <div class="h-full flex flex-col items-center text-slate-200 justify-center gap-10 p-4">
            <h1 class="text-2xl font-extrabold">What will the weather be like? 
                <button class="text-amber-600" data-button="focus">Find out</button>!
            </h1>
            <img src=${homeDefaultBg} />
        </div>
    `;

export default DefaultSidebar;
