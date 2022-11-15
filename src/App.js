const MissionUtils = require("@woowacourse/mission-utils");
const { MESSAGE, ERROR } = require("./constant");
const Lotto = require("./Lotto");
const Result = require("./Result");
const Amount = require("./Amount");
class App {
  constructor() {
    this.myMoney = 0;
  }

  play() {
    this.inputAmount();
  }

  inputAmount() {
    MissionUtils.Console.readLine(MESSAGE.INPUT_AMOUNT, (answer) => {
      if (new Amount(+answer)) {
        this.myMoney += +answer;
      }
      const piece = +answer / 1000;
      MissionUtils.Console.print(`${piece}개를 구매했습니다.`);
      this.createLottoBundle(piece);
    });
  }

  createLottoBundle(piece) {
    const bundle = [];
    for (let i = 0; i < piece; i++) {
      bundle.push(
        MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6).sort(
          (a, b) => a - b
        )
      );
    }
    const bundleString = bundle.map((x) => JSON.stringify(x));
    const bundleForPrint = bundleString.map((x) => x.replaceAll(",", ", "));
    bundleForPrint.forEach((x) => MissionUtils.Console.print(x));
    this.inputLottoNumber(bundle);
  }

  inputLottoNumber(bundle) {
    const numbers = [];
    MissionUtils.Console.readLine(MESSAGE.INPUT_LOTTO, (answer) => {
      const answerArray = answer.split(",");
      if (new Lotto(answerArray)) {
        answerArray.forEach((x) => numbers.push(+x));
      }
      this.inputBonusNumber(bundle, numbers);
    });
  }

  inputBonusNumber(bundle, numbers) {
    MissionUtils.Console.readLine(MESSAGE.INPUT_BONUS, (answer) => {
      if (numbers.includes(+answer)) {
        throw new Error(ERROR.BONUS_DUPLICATION);
      }
      if (+answer > 45 || +answer < 1) {
        throw new Error(ERROR.BONUS_RANGE);
      }
      if (isNaN(+answer)) {
        throw new Error(ERROR.BONUS_ISNAN);
      }
      const bonus = +answer;
      new Result(this.myMoney).statistics(bundle, numbers, bonus);
    });
  }
}
const app = new App();
app.play();
module.exports = App;
