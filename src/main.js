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

const rectList = [
    { top: 420, left: 30, width: 270, height: 155, thrMin: 80, thrMax: 256, zoom: 2, lng: "jpn" },    //サブop名4種
    { top: 350, left: 85, width: 220, height: 80, thrMin: 80, thrMax: 256, zoom: 2, lng: "jpn" },     //メインop名
    { top: 575, left: 100, width: 315, height: 65, thrMin: 80, thrMax: 256, zoom: 2, lng: "jpn" },    //セット
    { top: 190, left: 180, width: 235, height: 65, thrMin: 20, thrMax: 256, zoom: 2, lng: "jpn" },    //レア度

    { top: 420, left: 300, width: 115, height: 155, thrMin: 80, thrMax: 256, zoom: 4, lng: "eng" },   //サブop数値4種
    { top: 350, left: 305, width: 110, height: 80, thrMin: 80, thrMax: 256, zoom: 2, lng: "eng" },    //メインop数値
    { top: 213, left: 65, width: 24, height: 18, thrMin: 140, thrMax: 220, zoom: 5, lng: "eng" },      //レベル(通常)
    { top: 193, left: 130, width: 45, height: 30, thrMin: 180, thrMax: 256, zoom: 5, lng: "eng" },    //強化(通常)
    { top: 188, left: 65, width: 24, height: 18, thrMin: 110, thrMax: 256, zoom: 2.5, lng: "eng" },      //レベル(裂傷)
    { top: 167, left: 130, width: 45, height: 30, thrMin: 180, thrMax: 256, zoom: 5, lng: "eng" },    //強化(裂傷)
];

const opNameList = [
    { match: "攻", langJp: "攻撃力", langEng: "Attack" },
    { match: "防", langJp: "防御力", langEng: "Defense" },
    { match: "生命", langJp: "生命力", langEng: "Health" },
    { match: "スピ", langJp: "スピード", langEng: "Speed" },
    { match: "発生", langJp: "クリティカル発生率", langEng: "CriticalHitChance" },
    { match: "ダメ", langJp: "クリティカルダメージ", langEng: "CriticalHitDamage" },
    { match: "命中", langJp: "効果命中率", langEng: "Effectiveness" },
    { match: "抵抗", langJp: "効果低効率", langEng: "EffectResistance" },
];

const setNameList = [
    { match: "攻", langJp: "攻撃", langEng: "AttackSet" },
    { match: "防", langJp: "防御", langEng: "DefenseSet" },
    { match: "生命", langJp: "生命", langEng: "HealthSet" },
    { match: "速度", langJp: "速度", langEng: "SpeedSet" },
    { match: "会心", langJp: "会心", langEng: "CriticalSet" },
    { match: "破", langJp: "破滅", langEng: "DestructionSet" },
    { match: "命中", langJp: "命中", langEng: "HitSet" },
    { match: "抵抗", langJp: "抵抗", langEng: "ResistSet" },
    { match: "吸収", langJp: "吸収", langEng: "LifestealSet" },
    { match: "反", langJp: "反撃", langEng: "CounterSet" },
    { match: "連", langJp: "連携", langEng: "UnitySet" },
    { match: "免疫", langJp: "免疫", langEng: "ImmunitySet" },
    { match: "憤怒", langJp: "憤怒", langEng: "RageSet" },
    { match: "貫通", langJp: "貫通", langEng: "PenetrationSet" },
    { match: "復讐", langJp: "復讐", langEng: "RevengeSet" },
    { match: "裂傷", langJp: "裂傷", langEng: "InjurySet" },
];

const rareList = [
    { match: "エピ", langJp: "エピック", langEng: "Epic" },
    { match: "レジ", langJp: "レジェンド", langEng: "Heroic" },
    { match: "レア", langJp: "レア", langEng: "Rare" },
    { match: "ユニ", langJp: "ユニーク", langEng: "Good" },
    { match: "マル", langJp: "ノーマル", langEng: "Normal" },
];

const partsList = [
    { match: "武器", langJp: "武器", langEng: "Weapon" },
    { match: "頭", langJp: "頭", langEng: "Helmet" },
    { match: "胴", langJp: "胴", langEng: "Armor" },
    { match: "首", langJp: "首", langEng: "Necklace" },
    { match: "指", langJp: "指", langEng: "Ring" },
    { match: "脚", langJp: "脚", langEng: "Boots" },
];

let isCsv = false;

function loadFile(file){
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader);
        reader.readAsDataURL(file);
    });
}

function loadImage(file){
    return new Promise(async(resolve) => {
        let reader = await loadFile(file);
        let image = new Image();
        image.onload = () => resolve(image);
        image.src = reader.result;
    });
}

function deleteCanvas(){
    $(".tmp_canvas").remove();
}

async function writeCanvas(file){
    const padding = 20;
    deleteCanvas();
    let image = await loadImage(file);

    for(let i = 0; i < rectList.length; i++){
        let canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.width = rectList[i].width * rectList[i].zoom;
        canvas.height = rectList[i].height * rectList[i].zoom;
        canvas.className = "tmp_canvas " + rectList[i].lng;
        let ctx = canvas.getContext("2d");
        ctx.scale(rectList[i].zoom, rectList[i].zoom);
        ctx.drawImage(image, -rectList[i].left, -rectList[i].top);

        let imageData = ctx.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
        if (rectList[i].thrMin >= 0){
            imageData = filterThreshold(imageData, rectList[i].thrMin, rectList[i].thrMax);
        }

        imageData = filterReverse(imageData);

        canvas.width += padding;
        canvas.height += padding;
        ctx.putImageData(imageData, padding / 2, padding / 2);
    }
}

function changeFile(){
    //チェック用1件のみ表示
    let files = document.getElementById("gear_file").files;
    if (files.length > 0){
        (async () => {
            await writeCanvas(files[0]);
        })();
    }
}

//二極化
function filterThreshold(imageData, thrMin, thrMax){
    let data = imageData.data;
    for(let i = 0; i < data.length; i += 4){
        let tmp = 0;
        if (thrMin < ((data[i] + data[i+1] + data[i+2]) / 3) && ((data[i] + data[i+1] + data[i+2]) / 3) < thrMax)
            tmp = 255;
        data[i] = data[i + 1] = data[i + 2] = tmp;
    }
    return imageData;
}

//反転
function filterReverse(imageData){
    let data = imageData.data;
    for(let i = 0; i < data.length; i += 4){
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    return imageData;
}

function createWorker(lng){
    return new Promise(async(resolve) => {
        const worker = Tesseract.createWorker();
        await worker.load();
        await worker.loadLanguage(lng);
        await worker.initialize(lng);
        if (lng === "eng")
            await worker.setParameters({tessedit_char_whitelist: "0123456789%+"});
        else
            await worker.setParameters({tessedit_char_whitelist: "連携攻撃力生命スピード効果抵抗率中防御速度のセットクリティカルダメジ発会心復讐破滅吸収免疫反裂傷貫通ノマレェンアエ武器頭具胴首飾り指輪脚ユニ憤怒"});
        resolve(worker);
    });
}

function csvDownload(gearList){
    let data = "";
    for (let i = 0; i < gearList.length; i++){
        checkGearData(gearList[i]);
        data +=
            gearList[i].fileName
            + "," + getLevel(gearList[i])
            + "," + gearList[i].rare
            + "," + gearList[i].parts
            + "," + getEnhance(gearList[i])
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
    const blob = new Blob([bom, data], {"type": "text/csv"});
    const download = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    download.href = url;
    download.download = "geardata.csv";
    download.click();
    window.URL.revokeObjectURL(url);
}

function isNum(value, isPer, max = null, min = null){
    const ptn = isPer ? /^[0-9]+%?$/ : /^[0-9]+$/;
    if (!ptn.test(value))
        return false;
    let num = Number(value.replace("%", ""));
    if (max != null && num > max)
        return false;
    return !(min != null && num < min);
}

function checkGearData(gearData){
    let message = "";
    message += gearData.parts === "" ? "部位不明、" : "";
    message += gearData.rare === "" ? "レア度不明、" : "";
    message += gearData.setName === "" ? "セット不明、" : "";
    message += !isNum(getLevel(gearData), false) ? "レベル異常" + getLevel(gearData) + "、" : "";
    message += !isNum(getEnhance(gearData), false, 15, 0) ? "強化数異常" + getEnhance(gearData) + "、" : "";
    message += gearData.mainOpName === "" ? "メインOp不明、" : "";
    message += !isNum(gearData.mainOpValue, true) ? "メインOp異常" + gearData.mainOpValue + "、" : "";
    message += !isNum(gearData.sub1OpValue, true) ? "サブOp1異常" + gearData.sub1OpValue + "、" : "";
    message += !isNum(gearData.sub2OpValue, true) ? "サブOp2異常" + gearData.sub2OpValue + "、" : "";
    message += !isNum(gearData.sub3OpValue, true) ? "サブOp3異常" + gearData.sub3OpValue + "、" : "";
    message += !isNum(gearData.sub4OpValue, true) ? "サブOp4異常" + gearData.sub4OpValue + "、" : "";

    if (message === "")
        return true;
    else {
        $("#error_field").append("<div>" + gearData.fileName + " : " + message + "</div>");
        return false;
    }
}

function parseE7OptOption(name, value){
    if (name === "")
        return "";
    if (value.indexOf("%") >= 0){
        value = value.replace("%", "");
        name += "Percent";
    }
    return '{"type":"' + name + '","value":' + value + '}';
}

function e7OptDownload(gearList){
    let dataList = [];
    for (let i = 0; i < gearList.length; i++){
        if (!checkGearData(gearList[i]))
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
            + '"level":' + getLevel(gearList[i]) + ','
            + '"enhance":' + getEnhance(gearList[i]) + ','
            + '"main":' + parseE7OptOption(gearList[i].mainOpName, gearList[i].mainOpValue) + ','
            + '"substats":[' + subList.filter(x => x !== "").join(',') + '],'
            + '"name":"unknown",'
            + '"heroName":null'
            + "}");
    }
    const data = '{"items":[' + dataList.join(',') + ']}';
    const blob = new Blob([data], {"type": "text/plain"});
    const download = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    download.href = url;
    download.download = "geardatae7opt.txt";
    download.click();
    window.URL.revokeObjectURL(url);
}

function getLevel(gearData){
    if (gearData.setName === "裂傷" || gearData.setName === "InjurySet")
        return gearData.levelInj;
    else
        return gearData.level;
}

function getEnhance(gearData){
    if (gearData.setName === "裂傷" || gearData.setName === "InjurySet")
        return gearData.enhanceInj;
    else
        return gearData.enhance;
}

function parseText(value, isFirst = false){
    //最初のみ抽出
    if (isFirst)
        value = value.split('\n')[0];
    return value.replaceAll(/[ \n]/ig,"");
}

//数値系
function parseValue(value, max = -1, isFirst = false){
    value = parseText(value, isFirst);
    let result = value.match(/[0-9%]+/gi);
    let resultValue = result ? result[0] : "0";
    if (max !== -1)
        resultValue = parseInt(resultValue) > max ? "0" : resultValue;
    return resultValue;
}

//リスト一致
function parseList(value, list){
    value = parseText(value);
    let m = list.find(x => value.indexOf(x.match) >= 0);
    if (m)
        if (isCsv)
            return m.langJp;
        else
            return m.langEng;
    else
        return "";
}

//サブオプション名用
function parseSubName(value, index, list){
    let sp = value.split(/\n+/ig);
    if (sp.length > index)
        return parseList(sp[index], list);
    else
        return "";
}

//サブオプション数値用
function parseSubValue(value, index){
    let sp = value.split(/\n+/ig);
    if (sp.length > index)
        return parseValue(sp[index]);
    else
        return "0";
}

//強化用
function parseEnhance(value){
    return parseValue(value, 15);
}

async function ocrExec(files){
    console.log("準備開始\t"+ new Date());
    const schedulerJp = Tesseract.createScheduler();
    const schedulerEng = Tesseract.createScheduler();
    schedulerJp.addWorker(await createWorker('jpn'));
    schedulerJp.addWorker(await createWorker('jpn'));
    schedulerEng.addWorker(await createWorker('eng'));
    schedulerEng.addWorker(await createWorker('eng'));
    let gearList = [];
    console.log("準備終了\t"+ new Date());

    for (let i = 0; i < files.length; i++){
        $("#status_field").text("ファイル解析中(" + (i + 1) + "/" + files.length + ")");
        await writeCanvas(files[i]);

        const resultsJp = await Promise.all(Array.from($(".tmp_canvas.jpn")).map((canvas) => (
            schedulerJp.addJob('recognize', canvas)
        )));
        const resultsEng = await Promise.all(Array.from($(".tmp_canvas.eng")).map((canvas) => (
            schedulerEng.addJob('recognize', canvas)
        )));
        let rowDataJp = resultsJp.map(({ data: { text } }) => text);
        let rowDataEng = resultsEng.map(({ data: { text } }) => text);
        let gearData = {
            fileName: files[i].name,
            rare: parseList(rowDataJp[rareIndex], rareList),
            parts: parseList(rowDataJp[rareIndex], partsList),
            enhance: parseEnhance(rowDataEng[enhanceIndex]),
            enhanceInj: parseEnhance(rowDataEng[enhanceIndexInj]),
            level: parseValue(rowDataEng[levelIndex]),
            levelInj: parseValue(rowDataEng[levelIndexInj]),
            setName: parseList(rowDataJp[setIndex], setNameList),
            mainOpName: parseList(rowDataJp[mainOpNameIndex], opNameList),
            mainOpValue: parseValue(rowDataEng[mainOpValueIndex]),
            sub1OpName: parseSubName(rowDataJp[subOpNameIndex], 0, opNameList),
            sub2OpName: parseSubName(rowDataJp[subOpNameIndex], 1, opNameList),
            sub3OpName: parseSubName(rowDataJp[subOpNameIndex], 2, opNameList),
            sub4OpName: parseSubName(rowDataJp[subOpNameIndex], 3, opNameList),
            sub1OpValue: parseSubValue(rowDataEng[subOpValueIndex], 0),
            sub2OpValue: parseSubValue(rowDataEng[subOpValueIndex], 1),
            sub3OpValue: parseSubValue(rowDataEng[subOpValueIndex], 2),
            sub4OpValue: parseSubValue(rowDataEng[subOpValueIndex], 3),
        };
        console.log(rowDataJp);
        console.log(rowDataEng);
        gearList.push(gearData);
    }
    console.log(gearList);
    console.log("解析終了\t"+ new Date());

    await schedulerJp.terminate();
    await schedulerEng.terminate();

    return gearList;
}

function readGear(){
    $("#read_button").prop("disabled", true);
    $("#error_field").html("");
    isCsv = $("input[name=download_type]:checked").val() === "csv";
    let files = document.getElementById("gear_file").files;
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