import homeDefault from '../constants/images';

const defaultView = () => `
        <div class="h-full flex flex-col items-center justify-center gap-10 p-4">
            <h1 class="text-xl font-extrabold">What will the weather be like? 
                <button class="text-amber-600" data-button="focus">Find out</button>!
            </h1>
            <img src=${homeDefault} />
        </div>
    `;

export default defaultView;
