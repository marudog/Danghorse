const START_LINE = 50;

const trackContainer = document.getElementById("trackContainer");
const startBtn = document.getElementById("startBtn");
const winnerDisplay = document.getElementById("winner");

let NUM_HORSES = 5;
let horses = [];
let horseSpeeds = []; // 말마다 최대 속도 저장

let raceInProgress = false;

document.getElementById("setHorseCountBtn").addEventListener("click", () => {
	const horseCountInput = document.getElementById("horseCount");
	const newHorseCount = parseInt(horseCountInput.value);

	if (isNaN(newHorseCount) || newHorseCount < 1 || newHorseCount > 20) {
	  alert("1에서 20 사이의 유효한 숫자를 입력하세요.");
	  return;
	}

	NUM_HORSES = newHorseCount; // 말 마리수 업데이트
	// alert(`말 마리수가 ${NUM_HORSES}마리로 설정되었습니다.`);
	setupRace(); // 트랙 초기화
  });

  document.getElementById("setHorseNamesBtn").addEventListener("click", () => {
	const horseNamesInput = document.getElementById("horseNames").value;
	const names = horseNamesInput.split(",").map(name => name.trim());

	if (names.length !== NUM_HORSES) {
	  alert(`말 이름은 ${NUM_HORSES}개를 입력해야 합니다.`);
	  return;
	}

	horseNames = names; // 사용자 입력으로 말 이름 설정
	// alert("말 이름이 설정되었습니다!");
	const nameLabels = document.querySelectorAll(".name-label");
  	nameLabels.forEach((label, index) => {
    label.textContent = horseNames[index];
  });
  });

function setupRace() {
	trackContainer.innerHTML = "";
	horses = [];
	horseSpeeds = [];
	horseNames = []; // 말 이름 초기화

	for (let i = 0; i < NUM_HORSES; i++) {
		const trackDiv = document.createElement("div");
		trackDiv.className = "track";

		const nameLabel = document.createElement("div");
		nameLabel.className = "name-label";
		const horseName = `댕마 ${i + 1}`; // 기본 이름 설정
		horseNames.push(horseName); // 이름 저장
		nameLabel.textContent = horseName;

		const laneLabel = document.createElement("div");
		laneLabel.className = "lane-label";
		// laneLabel.textContent = `${i + 1}번`;

		const horseDiv = document.createElement("div");
		horseDiv.className = "horse";
		horseDiv.id = `horse${i + 1}`;

		const img = document.createElement("img");
		img.src = `images/horse${i + 1}.gif`; // 🆕 기본 이미지로 초기화
		img.alt = `Horse ${i + 1}`;

		horseDiv.appendChild(img);
		trackDiv.appendChild(nameLabel);
		trackDiv.appendChild(laneLabel);
		trackDiv.appendChild(horseDiv);
		trackContainer.appendChild(trackDiv);

		horses.push(horseDiv);
	}
}

startBtn.addEventListener("click", () => {
	if (raceInProgress) return;
	raceInProgress = true;

	startBtn.style.display = "none";

	winnerDisplay.textContent = "";
	winnerDisplay.style.display = "none";

	horses.forEach((horse, index) => {
		const horseImg = horse.querySelector("img");
		horseImg.src = `images/horse${index + 1}.gif`; // 기본 이미지로 초기화
		horseImg.style.transform = "scaleY(1)"; // 상하 반전 해제
	  });

	// 🆕 매번 새로운 속도 설정
	horseSpeeds = [];
	for (let i = 0; i < NUM_HORSES; i++) {
		const randomSpeed = getSecureRandomFloat(4, 12);; // 예: 4~16 범위
		horseSpeeds.push(randomSpeed);
		console.log(`🏇 Horse ${i + 1} speed: ${randomSpeed.toFixed(2)} px/frame`);
	}

	horses.forEach(horse => horse.style.left = START_LINE + "px");

	const intervals = [];
	let winnerFound = false;

	const track = document.querySelector(".track");
	const finishLineX = track.getBoundingClientRect().right - 4;

	horses.forEach((horse, index) => {
		let pos = START_LINE;
		const interval = setInterval(() => {
			const step = getSecureRandomFloat(0, horseSpeeds[index]);
			const horseX = horse.getBoundingClientRect().right;

			const leaderX = Math.max(...horses.map(h => h.getBoundingClientRect().right));

			// 🆕 하위권 말 속도 보정
			if (horseX < leaderX - 100) { // 1등 말과 100px 이상 차이 나는 경우
				pos += step * 2.0; // 속도 1.5배 증가
			} else {
				pos += step;
			}

			if (horseX + step >= finishLineX) {
				const offset = finishLineX - horseX;
				pos += offset;
				horse.style.left = pos + "px";

				if (!winnerFound) {
					winnerFound = true;
					raceInProgress = false;

					const winningHorseName = horseNames[index];

					winnerDisplay.textContent = `🏆 우승: ${index + 1}번 ${winningHorseName} `;
					winnerDisplay.style.display = "block";
					startBtn.style.display = "block";
					intervals.forEach(clearInterval);

					const winnerHorseImg = horse.querySelector("img");
					winnerHorseImg.src = `images/horse${index + 1}_winner.gif`;

					horses.forEach((otherHorse, otherIndex) => {
						if (otherIndex !== index) { // 우승한 말 제외
						  const otherHorseImg = otherHorse.querySelector("img");
						  otherHorseImg.style.transform = "scaleY(-1)"; // 상하 반전
						}
					});

					checkBettingResult(index + 1);
				}
			} else {
				pos += step;
				horse.style.left = pos + "px";
			}
		}, 50);
		intervals.push(interval);
	});
});

function getSecureRandomFloat(min = 0, max = 1) {
	const array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	const random = array[0] / (0xFFFFFFFF + 1);
	return min + (max - min) * random;
}

setupRace();
