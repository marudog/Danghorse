let userBet = null; // 사용자가 베팅한 말 번호
let betAmount = 0; // 베팅 금액

// 베팅 버튼 이벤트 리스너
document.getElementById("placeBetBtn").addEventListener("click", () => {
  const horseSelect = document.getElementById("horseSelect");
  const betInput = document.getElementById("betAmount");

  userBet = parseInt(horseSelect.value); // 베팅한 말 번호
  betAmount = parseInt(betInput.value); // 베팅 금액

  if (isNaN(betAmount) || betAmount <= 0) {
    alert("유효한 베팅 금액을 입력하세요.");
    return;
  }

  alert(`${userBet}번 말에 ${betAmount}원을 베팅했습니다!`);
});

// 베팅 결과 확인 함수
function checkBettingResult(winningHorse) {
  if (userBet === winningHorse) {
    alert(`축하합니다! ${betAmount * 2}원을 획득했습니다!`);
  } else {
    alert("아쉽습니다! 베팅에 실패했습니다.");
  }
}