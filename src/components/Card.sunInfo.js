import { formatTime } from '../utils/helpers';

const SunInfoCard = (className, { seconds, timezone }) => `
        <div class="${className} h-full w-full rounded-lg bg-slate-200 overflow-hidden">
            <div class="overlay flex items-end justify-start gap-2 h-full w-full p-2">
                <div class="px-2 rounded-lg">
                    <h2>${formatTime(seconds, timezone)}</h2>
                </div>
            </div>
        </div>
    `;

export default SunInfoCard;
