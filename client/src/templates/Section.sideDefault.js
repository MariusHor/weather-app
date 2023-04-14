import homeDefaultBg from 'constants/images';
import FavoritesContainer from './Section.favoritesContainer';

const sideDefault = favorites => `

        <div class="h-full grid">
            <div class="h-full flex flex-col items-center text-slate-200 justify-center gap-10 p-4">
                <h1 class="text-2xl font-extrabold text-center">What will the weather be like? 
                    <button class="text-amber-600 relative p-1" data-button="focus">
                        <span class="cta hover:text-slate-200 transition ease-in-out">Find out</span>
                    </button>!
                </h1>
                <div class="max-w-sm">
                    <img src=${homeDefaultBg} />
                </div>
            </div>
             ${favorites.length ? FavoritesContainer(favorites) : ''}
        </div>
    `;

export default sideDefault;
