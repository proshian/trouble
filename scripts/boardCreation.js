export const slotArray = [];

const field = document.querySelector('.field');
const feildRect = field.getBoundingClientRect();
const feildX = feildRect.x;  
const feildY = feildRect.y;

const fragment = document.createDocumentFragment();



function getHalfHeight(element) {
	return Math.round(
		parseInt(
			window.getComputedStyle(element).height
		) / 2
	);
}

// получить высоту родительского div'а (те поля)
const halfFieldHeight = getHalfHeight(field);

// чтобы получить высоту слота
// создадим и удалим один элемент
const slot = document.createElement('button');
slot.classList.add('feildSlot'); // ! возможно, лучше className
field.appendChild(slot);

const halfFieldSlotHeight = getHalfHeight(slot);

field.removeChild(slot);


const radius = halfFieldHeight - halfFieldSlotHeight;

const slotsNum = 28; // число слотов

const offset = 0;

for (let i = 0; i < slotsNum; i++) {

	// угол
	// отрицателен, чтобы слоты расположились "по часовой стрелке"
	const theta = -2 * Math.PI * i / slotsNum + offset;

	const slot = document.createElement('button');
	slot.type = "button";
	slot.classList.add('feildSlot'); // ! возможно, лучше className
	

	slot.innerText = i;	// ! убрать

	const x = Math.round(radius * Math.cos(theta)) + feildX;
	const y = Math.round(radius * Math.sin(theta)) - feildY;


	slot.style.top = (radius - y) + 'px';
	slot.style.left = (radius + x) + 'px';

	fragment.appendChild(slot);
	slotArray.push(slot);
}


field.appendChild(fragment);