const subOpNameIndex = 0;
const mainOpNameIndex = 1;
const setIndex = 2;
const rareIndex = 3;

const subOpValueIndex = 0;
const mainOpValueIndex = 1;
const levelIndex = 2;
const enhanceIndex = 3;
const levelIndexInj = 4;
const enhanceIndexInj = 5;

//座標情報用
class RectInfo {
    top: number;
    left: number;
    width: number;
    height: number;
    thrMin: number;
    thrMax: number;
    zoom: number;
    lng: string;
    constructor(top: number, left: number, width: number, height: number, thrMin: number, thrMax: number, zoom: number, lng: string) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.thrMin = thrMin;
        this.thrMax = thrMax;
        this.zoom = zoom;
        this.lng = lng;
    }
}
const rectList = [
    new RectInfo(420, 30, 270, 155, 80, 256, 2, "jpn"),     //サブop名4種
    new RectInfo(350, 85, 220, 80, 80, 256, 2, "jpn"),      //メインop名
    new RectInfo(575, 100, 315, 65, 80, 256, 2, "jpn"),     //セット
    new RectInfo(190, 180, 235, 65, 20, 256, 2, "jpn"),     //レア度

    new RectInfo(420, 300, 115, 155, 80, 256, 4, "eng"),    //サブop数値4種
    new RectInfo(350, 305, 110, 80, 80, 256, 2, "eng"),     //メインop数値
    new RectInfo(213, 65, 24, 18, 140, 220, 5, "eng"),      //レベル(通常)
    new RectInfo(193, 130, 45, 30, 180, 256, 5, "eng"),     //強化(通常)
    new RectInfo(188, 65, 24, 18, 140, 220, 5, "eng"),      //レベル(裂傷)
    new RectInfo(167, 130, 45, 30, 180, 256, 5, "eng"),     //強化(裂傷)
];

class OcrMatchInfo {
    match: string;
    langJp: string;
    langEng: string;
    constructor(match: string, langJp: string, langEng: string) {
        this.match = match;
        this.langJp = langJp;
        this.langEng = langEng;
    }
}
const opNameList = [
    new OcrMatchInfo("攻", "攻撃力", "Attack"),
    new OcrMatchInfo("防", "防御力", "Defense"),
    new OcrMatchInfo("生命", "生命力", "Health"),
    new OcrMatchInfo("スピ", "スピード", "Speed"),
    new OcrMatchInfo("発生", "クリティカル発生率", "CriticalHitChance"),
    new OcrMatchInfo("ダメ", "クリティカルダメージ", "CriticalHitDamage"),
    new OcrMatchInfo("命中", "効果命中率", "Effectiveness"),
    new OcrMatchInfo("抵抗", "効果抵抗率", "EffectResistance"),
];

const setNameList = [
    new OcrMatchInfo("攻", "攻撃", "AttackSet"),
    new OcrMatchInfo("防", "防御", "DefenseSet"),
    new OcrMatchInfo("生命", "生命", "HealthSet"),
    new OcrMatchInfo("速度", "速度", "SpeedSet"),
    new OcrMatchInfo("会心", "会心", "CriticalSet"),
    new OcrMatchInfo("破", "破滅", "DestructionSet"),
    new OcrMatchInfo("命中", "命中", "HitSet"),
    new OcrMatchInfo("抵抗", "抵抗", "ResistSet"),
    new OcrMatchInfo("吸収", "吸収", "LifestealSet"),
    new OcrMatchInfo("反", "反撃", "CounterSet"),
    new OcrMatchInfo("連", "連携", "UnitySet"),
    new OcrMatchInfo("免疫", "免疫", "ImmunitySet"),
    new OcrMatchInfo("憤怒", "憤怒", "RageSet"),
    new OcrMatchInfo("貫通", "貫通", "PenetrationSet"),
    new OcrMatchInfo("復讐", "復讐", "RevengeSet"),
    new OcrMatchInfo("裂傷", "裂傷", "InjurySet"),
];

const rareList = [
    new OcrMatchInfo("エピ", "エピック", "Epic"),
    new OcrMatchInfo("レジ", "レジェンド", "Heroic"),
    new OcrMatchInfo("レア", "レア", "Rare"),
    new OcrMatchInfo("ユニ", "ユニーク", "Good"),
    new OcrMatchInfo("マル", "ノーマル", "Normal"),
];

const partsList = [
    new OcrMatchInfo("武器", "武器", "Weapon"),
    new OcrMatchInfo("頭", "頭", "Helmet"),
    new OcrMatchInfo("胴", "胴", "Armor"),
    new OcrMatchInfo("首", "首", "Necklace"),
    new OcrMatchInfo("指", "指", "Ring"),
    new OcrMatchInfo("脚", "脚", "Boots"),
];

//装備情報
export class GearInfo {
    fileName: string;
    rare: string;
    parts: string;
    enhance: string;
    enhanceInj: string;
    level: string;
    levelInj: string;
    setName: string;
    mainOpName: string;
    mainOpValue: string;
    sub1OpName: string;
    sub2OpName: string;
    sub3OpName: string;
    sub4OpName: string;
    sub1OpValue: string;
    sub2OpValue: string;
    sub3OpValue: string;
    sub4OpValue: string;
    constructor(fileName: string, rowDataJp: string[], rowDataEng: string[]) {
        this.fileName = fileName;
        this.rare = GearInfo.parseList(rowDataJp[rareIndex], rareList);
        this.parts = GearInfo.parseList(rowDataJp[rareIndex], partsList);
        this.enhance = GearInfo.parseEnhance(rowDataEng[enhanceIndex]);
        this.enhanceInj = GearInfo.parseEnhance(rowDataEng[enhanceIndexInj]);
        this.level = GearInfo.parseValue(rowDataEng[levelIndex]);
        this.levelInj = GearInfo.parseValue(rowDataEng[levelIndexInj]);
        this.setName = GearInfo.parseList(rowDataJp[setIndex], setNameList);
        this.mainOpName = GearInfo.parseList(rowDataJp[mainOpNameIndex], opNameList);
        this.mainOpValue = GearInfo.parseValue(rowDataEng[mainOpValueIndex]);
        this.sub1OpName = GearInfo.parseSubName(rowDataJp[subOpNameIndex], 0, opNameList);
        this.sub2OpName = GearInfo.parseSubName(rowDataJp[subOpNameIndex], 1, opNameList);
        this.sub3OpName = GearInfo.parseSubName(rowDataJp[subOpNameIndex], 2, opNameList);
        this.sub4OpName = GearInfo.parseSubName(rowDataJp[subOpNameIndex], 3, opNameList);
        this.sub1OpValue = GearInfo.parseSubValue(rowDataEng[subOpValueIndex], 0);
        this.sub2OpValue = GearInfo.parseSubValue(rowDataEng[subOpValueIndex], 1);
        this.sub3OpValue = GearInfo.parseSubValue(rowDataEng[subOpValueIndex], 2);
        this.sub4OpValue = GearInfo.parseSubValue(rowDataEng[subOpValueIndex], 3);
    }

    //レベル情報取得
    getLevel() {
        if (this.setName === "裂傷" || this.setName === "InjurySet")
            return this.levelInj;
        else
            return this.level;
    }

    //強化情報取得
    getEnhance() {
        if (this.setName === "裂傷" || this.setName === "InjurySet")
            return this.enhanceInj;
        else
            return this.enhance;
    }

    //データチェック
    checkGearData() {
        let message = "";
        message += this.parts === "" ? "部位不明、" : "";
        message += this.rare === "" ? "レア度不明、" : "";
        message += this.setName === "" ? "セット不明、" : "";
        message += !GearInfo.isNum(this.getLevel(), false) ? "レベル異常" + this.getLevel() + "、" : "";
        message += !GearInfo.isNum(this.getEnhance(), false, 15, 0) ? "強化数異常" + this.getEnhance() + "、" : "";
        message += this.mainOpName === "" ? "メインOp不明、" : "";
        message += !GearInfo.isNum(this.mainOpValue, true) ? "メインOp異常" + this.mainOpValue + "、" : "";
        message += !GearInfo.isNum(this.sub1OpValue, true) ? "サブOp1異常" + this.sub1OpValue + "、" : "";
        message += !GearInfo.isNum(this.sub2OpValue, true) ? "サブOp2異常" + this.sub2OpValue + "、" : "";
        message += !GearInfo.isNum(this.sub3OpValue, true) ? "サブOp3異常" + this.sub3OpValue + "、" : "";
        message += !GearInfo.isNum(this.sub4OpValue, true) ? "サブOp4異常" + this.sub4OpValue + "、" : "";

        if (message === "")
            return true;
        else {
            $("#error_field").append("<div>" + this.fileName + " : " + message + "</div>");
            return false;
        }
    }

    //数値判定
    static isNum(value: string, isPer: boolean, max: number | null = null, min: number | null = null) {
        const ptn = isPer ? /^[0-9]+%?$/ : /^[0-9]+$/;
        if (!ptn.test(value))
            return false;
        let num = Number(value.replace("%", ""));
        if (max != null && num > max)
            return false;
        return !(min != null && num < min);
    }

    //テキスト変換
    static parseText(value: string, isFirst: boolean = false) {
        //最初のみ抽出
        if (isFirst)
            value = value.split('\n')[0];
        return value.replace(/[ \n]/ig, "");
    }

    //数値変換
    static parseValue(value: string, max: number = -1, isFirst: boolean = false) {
        value = GearInfo.parseText(value, isFirst);
        let result = value.match(/[0-9%]+/gi);
        let resultValue = result ? result[0] : "0";
        if (max !== -1)
            resultValue = parseInt(resultValue) > max ? "0" : resultValue;
        return resultValue;
    }

    //強化数変換
    static parseEnhance(value: string) {
        return GearInfo.parseValue(value, 15);
    }

    //リスト一致変換
    static parseList(value: string, list: OcrMatchInfo[]) {
        value = GearInfo.parseText(value);
        let m = list.find(x => value.indexOf(x.match) >= 0);
        if (m)
            if (isCsv)
                return m.langJp;
            else
                return m.langEng;
        else
            return "";
    }

    //サブOp名変換
    static parseSubName(value: string, index: number, list: OcrMatchInfo[]) {
        let sp = value.split(/\n+/ig);
        if (sp.length > index)
            return GearInfo.parseList(sp[index], list);
        else
            return "";
    }

    //サブOp数値変換
    static parseSubValue(value: string, index: number) {
        let sp = value.split(/\n+/ig);
        if (sp.length > index)
            return GearInfo.parseValue(sp[index]);
        else
            return "0";
    }
}

let isCsv = false;

//Tesseractユーティリティ
import { Tesseract, createScheduler, createWorker } from "tesseract.min.js";
export class TsUtil {
    schedulerJp: Tesseract.Scheduler;
    schedulerEng: Tesseract.Scheduler;

    constructor() {
        this.schedulerJp = createScheduler();
        this.schedulerEng = createScheduler();
    }

    //ユーティリティ初期化処理
    async init() {
        await this.createScheduler();
    }

    //Tesseractスケジューラー作成
    async createScheduler() {
        console.log("Tesseract準備開始\t" + new Date());
        this.schedulerJp.addWorker(await this.createWorker('jpn'));
        this.schedulerJp.addWorker(await this.createWorker('jpn'));
        this.schedulerEng.addWorker(await this.createWorker('eng'));
        this.schedulerEng.addWorker(await this.createWorker('eng'));
        console.log("Tesseract準備終了\t" + new Date());
    }

    //Tesseractワーカー作成
    async createWorker(lng: string): Promise<Tesseract.Worker> {
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage(lng);
        await worker.initialize(lng);
        if (lng === "eng")
            await worker.setParameters({ tessedit_char_whitelist: "0123456789%+" });
        else
            await worker.setParameters({ tessedit_char_whitelist: "連携攻撃力生命スピード効果抵抗率中防御速度のセットクリティカルダメジ発会心復讐破滅吸収免疫反裂傷貫通ノマレェンアエ武器頭具胴首飾り指輪脚ユニ憤怒" });
        return worker;
    }

    //Tesseract解析実行
    async execTesseract(isJp: boolean, canvasList: object[]) {
        const results: object[] = await Promise.all(canvasList.map((canvas) => (
            isJp ? this.schedulerJp.addJob('recognize', canvas) : this.schedulerEng.addJob('recognize', canvas)
        )));
        // @ts-ignore
        const rowData = results.map(({ data: { text } }) => text);
        console.log(rowData);
        return rowData;
    }

    //Tesseractスケジューラー終了
    async finishScheduler() {
        await this.schedulerJp.terminate();
        await this.schedulerEng.terminate();
    }
}

//Canvasユーティリティ
class CaUtil {
    //余白ピクセル
    padding = 20;
    image: HTMLImageElement;

    constructor() {
        this.image = new Image();
    }

    //初期化
    async initFile(file: File) {
        this.image = await this.loadImage(file);
    }

    //Fileオブジェクト読み込み
    loadFile(file: File): Promise<FileReader> {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader);
            reader.readAsDataURL(file);
        });
    }

    //imageデータ読み込み
    loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise(async (resolve) => {
            let reader = await this.loadFile(file);
            this.image.onload = () => resolve(this.image);
            if (typeof reader.result === "string") {
                this.image.src = reader.result;
            }
        });
    }

    //キャンバス描画
    async createCanvasAll(rectInfoList: object, isOption = true) {
        for (let i = 0; i < rectList.length; i++)
            await this.createCanvas(rectList[i], isOption);
    }

    //キャンバス描画
    async createCanvas(rectInfo: RectInfo, isOption = true) {
        let canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        //指定座標のcanvas作成
        canvas.width = rectInfo.width;
        canvas.height = rectInfo.height;
        canvas.className = "tmp_canvas " + rectInfo.lng;
        let ctx = canvas.getContext("2d");
        if (ctx == null)
            throw "画像描画中に未知のエラーが発生しました";

        //追加オプション処理
        if (isOption) {
            //zoom設定
            canvas.width *= rectInfo.zoom;
            canvas.height *= rectInfo.zoom;
            ctx.scale(rectInfo.zoom, rectInfo.zoom);
        }

        ctx.drawImage(this.image, -rectInfo.left, -rectInfo.top);

        //追加オプション処理
        if (isOption) {
            //二極化
            let imageData = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
            if (rectInfo.thrMin >= 0) {
                imageData = this.filterThreshold(imageData, rectInfo.thrMin, rectInfo.thrMax);
            }

            //色反転
            imageData = this.filterReverse(imageData);

            //余白追加
            canvas.width += this.padding;
            canvas.height += this.padding;
            ctx.putImageData(imageData, this.padding / 2, this.padding / 2);
        }
    }

    //二極化
    filterThreshold(imageData: ImageData, thrMin: number, thrMax: number) {
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let tmp = 0;
            if (thrMin < ((data[i] + data[i + 1] + data[i + 2]) / 3) && ((data[i] + data[i + 1] + data[i + 2]) / 3) < thrMax)
                tmp = 255;
            data[i] = data[i + 1] = data[i + 2] = tmp;
        }
        return imageData;
    }

    //反転
    filterReverse(imageData: ImageData) {
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        return imageData;
    }

    //キャンバス描画
    static async writeCanvas(file: File) {
        let caUtil = new CaUtil();
        await caUtil.initFile(file);
        await caUtil.createCanvasAll(rectList);
    }
}

function deleteCanvas() {
    $(".tmp_canvas").remove();
}

function csvDownload(gearList: GearInfo[] | undefined) {
    if (gearList == undefined) return;
    let data = "";
    for (let i = 0; i < gearList.length; i++) {
        gearList[i].checkGearData();
        data +=
            gearList[i].fileName
            + "," + gearList[i].getLevel()
            + "," + gearList[i].rare
            + "," + gearList[i].parts
            + "," + gearList[i].getEnhance()
            + "," + gearList[i].setName
            + "," + gearList[i].mainOpName
            + "," + gearList[i].mainOpValue
            + "," + gearList[i].sub1OpName
            + "," + gearList[i].sub1OpValue
            + "," + gearList[i].sub2OpName
            + "," + gearList[i].sub2OpValue
            + "," + gearList[i].sub3OpName
            + "," + gearList[i].sub3OpValue
            + "," + gearList[i].sub4OpName
            + "," + gearList[i].sub4OpValue
            + "\n";
    }
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, data], { "type": "text/csv" });
    const download = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    download.href = url;
    download.download = "geardata.csv";
    download.click();
    window.URL.revokeObjectURL(url);
}

function parseE7OptOption(name: string, value: string) {
    if (name === "")
        return "";
    if (value.indexOf("%") >= 0) {
        value = value.replace("%", "");
        name += "Percent";
    }
    return '{"type":"' + name + '","value":' + value + '}';
}

function e7OptDownload(gearList: GearInfo[] | undefined) {
    if (gearList == undefined) return;
    let dataList = [];
    for (let i = 0; i < gearList.length; i++) {
        if (!gearList[i].checkGearData())
            continue;

        let subList = [];
        subList.push(parseE7OptOption(gearList[i].sub1OpName, gearList[i].sub1OpValue));
        subList.push(parseE7OptOption(gearList[i].sub2OpName, gearList[i].sub2OpValue));
        subList.push(parseE7OptOption(gearList[i].sub3OpName, gearList[i].sub3OpValue));
        subList.push(parseE7OptOption(gearList[i].sub4OpName, gearList[i].sub4OpValue));
        dataList.push(
            "{"
            + '"gear":"' + gearList[i].parts + '",'
            + '"rank":"' + gearList[i].rare + '",'
            + '"set":"' + gearList[i].setName + '",'
            + '"level":' + gearList[i].getLevel() + ','
            + '"enhance":' + gearList[i].getEnhance() + ','
            + '"main":' + parseE7OptOption(gearList[i].mainOpName, gearList[i].mainOpValue) + ','
            + '"substats":[' + subList.filter(x => x !== "").join(',') + '],'
            + '"name":"unknown",'
            + '"heroName":null'
            + "}");
    }
    const data = '{"items":[' + dataList.join(',') + ']}';
    const blob = new Blob([data], { "type": "text/plain" });
    const download = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    download.href = url;
    download.download = "geardata_e7opt.txt";
    download.click();
    window.URL.revokeObjectURL(url);
}

//ocr実行
export async function ocrExec(files: FileList | null) {
    if (files == null) return;
    let ts = new TsUtil();
    await ts.init();

    let gearList = Array<GearInfo>();
    for (let i = 0; i < files.length; i++) {
        $("#status_field").text("ファイル解析中(" + (i + 1) + "/" + files.length + ")");
        deleteCanvas();
        await CaUtil.writeCanvas(files[i]);
        
        const canvasJp = Array.from($(".tmp_canvas.jpn"));
        const canvasEng = Array.from($(".tmp_canvas.eng"));

        const rowDataJp = await ts.execTesseract(true, canvasJp);
        const rowDataEng = await ts.execTesseract(false, canvasEng);
        gearList.push(new GearInfo(files[i].name, rowDataJp, rowDataEng));
    }
    console.log(gearList);
    console.log("解析終了\t" + new Date());

    await ts.finishScheduler();

    return gearList;
}

function changeFile() {
    //チェック用1件のみ表示
    let files = (<HTMLInputElement>document.getElementById('gear_file')).files;
    if (files != null && files.length > 0) {
        deleteCanvas();
        (async () => {
            await CaUtil.writeCanvas(files[0]);
        })();
    }
}

function readGear() {
    $("#read_button").prop("disabled", true);
    $("#error_field").html("");
    isCsv = $("input[name=download_type]:checked").val() === "csv";
    let files = (<HTMLInputElement>document.getElementById("gear_file")).files;
    let status = $("#status_field");

    (async () => {
        status.text("準備中..");
        let gearList = await ocrExec(files);
        deleteCanvas();
        if (isCsv)
            csvDownload(gearList);
        else
            e7OptDownload(gearList);

        status.text("終了");
        $("#read_button").prop("disabled", false);
    })();
}

window.onload = () => {
    $('#read_button').on('click', readGear);
    $('#gear_file').on('change', changeFile);
};