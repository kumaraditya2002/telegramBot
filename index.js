const {google} = require('googleapis');
const {Telegraf} = require('telegraf');
const { createCanvas ,registerFont} = require('canvas');
const fs = require("fs");
const {table,getBorderCharacters} = require('table');

//creating bot bot connection
const bot_token = "1703319491:AAGozZLtkDJgxUPO3DNuKxP3BTQy_jZ38kg";
const bot = new Telegraf(bot_token);

registerFont('Lato-Bold.ttf', { family:'Sans-Serif' })
//google sheet connection
const auth = new google.auth.GoogleAuth({
    keyFile:"credentials.json",
    scopes:"https://www.googleapis.com/auth/spreadsheets"
});

const client = auth.getClient();
const googleSheets = google.sheets({version:"v4",auth:client});
const ssId="1fiIlF9UEobxqmvjy2TH-lI1eHoFAikhKeGXeqeCKXvQ";

//bot commands 
bot.start(ctx=>{
    ctx.replyWithMarkdown(`Welcome *${ctx.from.first_name}*`);
    ctx.replyWithMarkdown(`*Commands:*\n1./name <name>\n2./id <id>\n3./manpower`);
});
bot.help(ctx=>{
    ctx.reply("help");
});

// /id <empid>
bot.command('id',async ctx=>{
    let id = ctx.from.username;
    // console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            let messg = ctx.message.text;
            let empId = messg.split(' ')[1];
        
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"Sheet1"
            })
        
            let ans = get_rows.data.values;
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] = ans[i][j];
                }
                finalArr.push(obj);
            }
            let arr = finalArr.filter(e=>e['EMPID']==empId)[0];
            if(!!!arr){
                ctx.reply("Emp Not Found");
            }else{
                let s='';
                props.forEach(e=>{
                    s += `*${e}* : ${!arr[e]?"-----":arr[e]}\n`
                })
                ctx.replyWithMarkdown(s);
            }
        }
    })
    .catch(err=>ctx.reply(err.message));
})

// /name <name>
bot.command('name',ctx=>{
    let id = ctx.from.username;
    // console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            let messg = ctx.message.text;
            let empName = messg.split(' ');
            empName.shift();
            let name=empName.join(' ');
            name=name.toUpperCase();
            // console.log(name)
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"Sheet1"
            })

            let ans = get_rows.data.values;
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] = ans[i][j];
                }
                finalArr.push(obj);
            }
            let arr = finalArr.filter(e=>e["NAME"].includes(name));
            let array=[];
            array.push(["EMPID",'NAME','DIVISION','DEPT'])
            for(let i=0 ; i<arr.length ; i++){
                let a=[];
                a.push(!arr[i]['EMPID']?"#NA":arr[i]['EMPID']);
                a.push(!arr[i]['NAME']?"#NA":arr[i]['NAME']);
                a.push(!arr[i]['DIVISION']?"#NA":arr[i]['DIVISION']);
                a.push(!arr[i]['DEPT']?"#NA":arr[i]['DEPT']);
                array.push(a);
            }
            
            const output = table(array,{
                border: getBorderCharacters('void'),
                columnDefault: {
                    paddingLeft: 0,
                    paddingRight: 1
                },
                drawHorizontalLine: () => true
            
            });
            console.log(output.length)
            if(output.length>4096){
                ctx.reply("Telegram messg word limit reached please try with another name");
            }else{
                ctx.reply(output);
                ctx.replyWithMarkdown(`*Total* : ${array.length-1}`);
            }
        }
    })
    .catch(err=>ctx.reply(err.message));
})
const pdfPath="D:\\WebDev\\telegramBot\\data.pdf";
// /manpower
bot.command('manpower',async ctx=>{
    let id = ctx.from.username;
    // console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"manpower"
            });
            let ans = get_rows.data.values;
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] =!ans[i][j]?"NA":ans[i][j];
                }
                finalArr.push(obj);
            }
            
            ctx.replyWithMarkdown(`*---DIVISIONS---*\n1. /tipong\n2. /tikak\n3. /tirap\n4. /tura\n5. /guwahatiarea\n*Total Manpower* : ${ans.length-1}`);
        }
    })
    .catch(err=>ctx.reply(err.message));
});

// /guwahatiarea
bot.command('guwahatiarea',async ctx=>{
    let id = ctx.from.username;
    console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"manpower"
            });
            let ans = get_rows.data.values;
            console.log(ans[0][0]);
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] =!ans[i][j]?"NA":ans[i][j];
                }
                finalArr.push(obj);
            }
            let array = finalArr.filter(e=>e["DIVISION"]==="GUWAHATI" || e["DIVISION"]==="KOLKATA" ||e["DIVISION"]==="SILIGURI" ||e["DIVISION"]==="SIMSANG PROJECT");
            let male=array.filter(e=>e["SEX"]=="M");
            let female=array.filter(e=>e["SEX"]=="F");
            let result=[];
            array.forEach(e=>{
                let temp=[];
                for (const key in e) {
                    if (Object.hasOwnProperty.call(e, key)) {
                        temp.push(e[key]);
                    }
                }
                result.push(temp);
            });
            console.log(result[0][0]);
            const canvas = createCanvas(800,1500,'pdf');
            const c = canvas.getContext('2d');
            c.font = '10px Sans';
        
            let maxName = Number.MIN_VALUE;
            let maxId=8;
            let maxCat=14;
            let maxDept=Number.MIN_VALUE;
            let maxDes=Number.MIN_VALUE;
            let maxDiv=Number.MIN_VALUE;
            for(let i=0 ; i<ans.length ; i++){
                if(ans[i][1].length >maxName){
                    maxName = ans[i][1].length;
                }
                if(ans[i][2].length>maxDes)
                    maxDes = ans[i][2].length;
                if(ans[i][3].length>maxDiv)
                    maxDiv = ans[i][3].length;
                if(ans[i][4].length>maxDept)
                    maxDept = ans[i][4].length;
            }
            maxName+=2;
            maxDept+=2;
            maxDes+=2;
            maxDiv+=2;
           
           let str="A",totalRows=result.length,pdfRows=95,pages=Math.ceil(totalRows/pdfRows),r=0,end=Math.min(95,totalRows),it=0;
           let row=15,col=5;
           let first=false;
           let curr=0;
            while(it<pages){
                str="A";
                c.font = '10px Sans';
                if(it==0){
                    if(!first){
                        c.font = 'bold 10px Sans';
                        str="..";
                        first=true;
                        c.fillText(props[0],col,row);
                        c.fillText(props[1],c.measureText(str.repeat(maxId)).width,row);
                        c.fillText(props[2],c.measureText(str.repeat(maxId+maxName)).width,row);
                        c.fillText(props[3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,row);
                        c.fillText(props[4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,row);
                        c.fillText(props[5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,row);
                        c.fillText(props[6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,row);
                    }
                    c.font = '10px Sans';
                    str="A";
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++){
                        c.fillText(result[i][0],col,(i+2)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(i+2)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(i+2)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(i+2)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(i+2)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(i+2)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(i+2)*row);
                    }
                }else{
                    let gap=1;
                    c.addPage();
                    c.font = '10px Sans';
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++,gap++){
                        c.fillText(result[i][0],col,(gap)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,gap*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,gap*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,gap*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,gap*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,gap*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,gap*row);   
                    }
                }
                curr+=end;
                it++;
            }
            fs.writeFileSync('data.pdf', canvas.toBuffer());
            ctx.telegram.sendDocument(ctx.from.id, {
                source: fs.readFileSync(pdfPath),
                filename: 'data.pdf'
            }).catch(function(error){ console.log(error); })
            ctx.replyWithMarkdown(`*Total Manpower* : ${array.length} \n*Male*:${male.length} \n*Female*:${female.length} \n*Sending full report please wait...*`);
        }
    })
    .catch(err=>console.log(err));
});

// /tipong
bot.command('tipong',async ctx=>{
    let id = ctx.from.username;
    console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"manpower"
            });
            let ans = get_rows.data.values;
            console.log(ans[0][0]);
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] =!ans[i][j]?"NA":ans[i][j];
                }
                finalArr.push(obj);
            }
            let array = finalArr.filter(e=>e["DIVISION"]==="TIPONG");
            let male=array.filter(e=>e["SEX"]=="M");
            let female=array.filter(e=>e["SEX"]=="F");
            let result=[];
            array.forEach(e=>{
                let temp=[];
                for (const key in e) {
                    if (Object.hasOwnProperty.call(e, key)) {
                        temp.push(e[key]);
                    }
                }
                result.push(temp);
            });
            // console.log(result[0][0]);
            const canvas = createCanvas(800,1500,'pdf');
            const c = canvas.getContext('2d');
            c.font = '10px Sans';
        
            let maxName = Number.MIN_VALUE;
            let maxId=8;
            let maxCat=14;
            let maxDept=Number.MIN_VALUE;
            let maxDes=Number.MIN_VALUE;
            let maxDiv=Number.MIN_VALUE;
            for(let i=0 ; i<ans.length ; i++){
                if(ans[i][1].length >maxName){
                    maxName = ans[i][1].length;
                }
                if(ans[i][2].length>maxDes)
                    maxDes = ans[i][2].length;
                if(ans[i][3].length>maxDiv)
                    maxDiv = ans[i][3].length;
                if(ans[i][4].length>maxDept)
                    maxDept = ans[i][4].length;
            }
            maxName+=2;
            maxDept+=2;
            maxDes+=2;
            maxDiv+=2;
           
           let str="A",totalRows=result.length,pdfRows=95,pages=Math.ceil(totalRows/pdfRows),r=0,end=95,it=0;
           let row=15,col=5;
           let first=false;
           let curr=0;
            while(it<pages){
                str="A";
                c.font = '10px Sans';
                if(it==0){
                    if(!first){
                        c.font = 'bold 10px Sans';
                        str="..";
                        first=true;
                        c.fillText(props[0],col,row);
                        c.fillText(props[1],c.measureText(str.repeat(maxId)).width,row);
                        c.fillText(props[2],c.measureText(str.repeat(maxId+maxName)).width,row);
                        c.fillText(props[3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,row);
                        c.fillText(props[4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,row);
                        c.fillText(props[5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,row);
                        c.fillText(props[6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,row);
                    }
                    c.font = '10px Sans';
                    str="A";
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++){
                        c.fillText(result[i][0],col,(i+2)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(i+2)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(i+2)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(i+2)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(i+2)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(i+2)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(i+2)*row);
                    }
                }else{
                    let gap=1;
                    c.addPage();
                    c.font = '10px Sans';
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++,gap++){
                        c.fillText(result[i][0],col,(gap)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(gap)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(gap)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(gap)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(gap)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(gap)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(gap)*row);   
                    }
                }
                curr+=end;
                it++;
            }
            fs.writeFileSync('data.pdf', canvas.toBuffer());
            ctx.telegram.sendDocument(ctx.from.id, {
                source: fs.readFileSync(pdfPath),
                filename: 'data.pdf'
            }).catch(function(error){ console.log(error); })
            ctx.replyWithMarkdown(`*Total Manpower* : ${array.length} \n*Male*:${male.length} \n*Female*:${female.length} \n*Sending full report please wait...*`);
        }
    })
    .catch(err=>console.log(err));
});

// /tikak
bot.command('tikak',async ctx=>{
    let id = ctx.from.username;
    console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"manpower"
            });
            let ans = get_rows.data.values;
            console.log(ans[0][0]);
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] =!ans[i][j]?"NA":ans[i][j];
                }
                finalArr.push(obj);
            }
            let array = finalArr.filter(e=>e["DIVISION"]==="TIKAK");
            let male=array.filter(e=>e["SEX"]=="M");
            let female=array.filter(e=>e["SEX"]=="F");
            let result=[];
            array.forEach(e=>{
                let temp=[];
                for (const key in e) {
                    if (Object.hasOwnProperty.call(e, key)) {
                        temp.push(e[key]);
                    }
                }
                result.push(temp);
            });
            // console.log(result[0][0]);
            const canvas = createCanvas(800,1500,'pdf');
            const c = canvas.getContext('2d');
            c.font = '10px Sans';
        
            let maxName = Number.MIN_VALUE;
            let maxId=8;
            let maxCat=14;
            let maxDept=Number.MIN_VALUE;
            let maxDes=Number.MIN_VALUE;
            let maxDiv=Number.MIN_VALUE;
            for(let i=0 ; i<ans.length ; i++){
                if(ans[i][1].length >maxName){
                    maxName = ans[i][1].length;
                }
                if(ans[i][2].length>maxDes)
                    maxDes = ans[i][2].length;
                if(ans[i][3].length>maxDiv)
                    maxDiv = ans[i][3].length;
                if(ans[i][4].length>maxDept)
                    maxDept = ans[i][4].length;
            }
            maxName+=2;
            maxDept+=2;
            maxDes+=2;
            maxDiv+=2;
           
           let str="A",totalRows=result.length,pdfRows=95,pages=Math.ceil(totalRows/pdfRows),r=0,end=95,it=0;
           let row=15,col=5;
           let first=false;
           let curr=0;
            while(it<pages){
                str="A";
                c.font = '10px Sans';
                if(it==0){
                    if(!first){
                        c.font = 'bold 10px Sans';
                        str="..";
                        first=true;
                        c.fillText(props[0],col,row);
                        c.fillText(props[1],c.measureText(str.repeat(maxId)).width,row);
                        c.fillText(props[2],c.measureText(str.repeat(maxId+maxName)).width,row);
                        c.fillText(props[3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,row);
                        c.fillText(props[4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,row);
                        c.fillText(props[5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,row);
                        c.fillText(props[6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,row);
                    }
                    c.font = '10px Sans';
                    str="A";
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++){
                        c.fillText(result[i][0],col,(i+2)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(i+2)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(i+2)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(i+2)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(i+2)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(i+2)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(i+2)*row);
                    }
                }else{
                    let gap=1;
                    c.addPage();
                    c.font = '10px Sans';
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++,gap++){
                        c.fillText(result[i][0],col,(gap)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(gap)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(gap)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(gap)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(gap)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(gap)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(gap)*row);   
                    }
                }
                curr+=end;
                it++;
            }
            fs.writeFileSync('data.pdf', canvas.toBuffer());
            ctx.telegram.sendDocument(ctx.from.id, {
                source: fs.readFileSync(pdfPath),
                filename: 'data.pdf'
            }).catch(function(error){ console.log(error); })
            ctx.replyWithMarkdown(`*Total Manpower* : ${array.length} \n*Male*:${male.length} \n*Female*:${female.length} \n*Sending full report please wait...*`);
        }
    })
    .catch(err=>console.log(err));
});

// /tirap
bot.command('tirap',async ctx=>{
    let id = ctx.from.username;
    console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"manpower"
            });
            let ans = get_rows.data.values;
            console.log(ans[0][0]);
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] =!ans[i][j]?"NA":ans[i][j];
                }
                finalArr.push(obj);
            }
            let array = finalArr.filter(e=>e["DIVISION"]==="TIRAP");
            let male=array.filter(e=>e["SEX"]=="M");
            let female=array.filter(e=>e["SEX"]=="F");
            let result=[];
            array.forEach(e=>{
                let temp=[];
                for (const key in e) {
                    if (Object.hasOwnProperty.call(e, key)) {
                        temp.push(e[key]);
                    }
                }
                result.push(temp);
            });
            // console.log(result[0][0]);
            const canvas = createCanvas(800,1500,'pdf');
            const c = canvas.getContext('2d');
            c.font = '10px Sans';
        
            let maxName = Number.MIN_VALUE;
            let maxId=8;
            let maxCat=14;
            let maxDept=Number.MIN_VALUE;
            let maxDes=Number.MIN_VALUE;
            let maxDiv=Number.MIN_VALUE;
            for(let i=0 ; i<ans.length ; i++){
                if(ans[i][1].length >maxName){
                    maxName = ans[i][1].length;
                }
                if(ans[i][2].length>maxDes)
                    maxDes = ans[i][2].length;
                if(ans[i][3].length>maxDiv)
                    maxDiv = ans[i][3].length;
                if(ans[i][4].length>maxDept)
                    maxDept = ans[i][4].length;
            }
            maxName+=2;
            maxDept+=2;
            maxDes+=2;
            maxDiv+=2;
           
           let str="A",totalRows=result.length,pdfRows=95,pages=Math.ceil(totalRows/pdfRows),r=0,end=95,it=0;
           let row=15,col=5;
           let first=false;
           let curr=0;
            while(it<pages){
                str="A";
                c.font = '10px Sans';
                if(it==0){
                    if(!first){
                        c.font = 'bold 10px Sans';
                        str="..";
                        first=true;
                        c.fillText(props[0],col,row);
                        c.fillText(props[1],c.measureText(str.repeat(maxId)).width,row);
                        c.fillText(props[2],c.measureText(str.repeat(maxId+maxName)).width,row);
                        c.fillText(props[3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,row);
                        c.fillText(props[4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,row);
                        c.fillText(props[5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,row);
                        c.fillText(props[6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,row);
                    }
                    c.font = '10px Sans';
                    str="A";
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++){
                        c.fillText(result[i][0],col,(i+2)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(i+2)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(i+2)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(i+2)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(i+2)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(i+2)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(i+2)*row);
                    }
                }else{
                    let gap=1;
                    c.addPage();
                    c.font = '10px Sans';
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++,gap++){
                        c.fillText(result[i][0],col,(gap)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(gap)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(gap)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(gap)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(gap)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(gap)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(gap)*row);   
                    }
                }
                curr+=end;
                it++;
            }
            fs.writeFileSync('data.pdf', canvas.toBuffer());
            ctx.telegram.sendDocument(ctx.from.id, {
                source: fs.readFileSync(pdfPath),
                filename: 'data.pdf'
            }).catch(function(error){ console.log(error); })
            ctx.replyWithMarkdown(`*Total Manpower* : ${array.length} \n*Male*:${male.length} \n*Female*:${female.length} \n*Sending full report please wait...*`);
        }
    })
    .catch(err=>console.log(err));
});

// /tura
bot.command('tura',async ctx=>{
    let id = ctx.from.username;
    console.log(id);
    ctx.reply("Authenticating...");
    authenticate(id)
    .then(async data=>{
        if(!data){
            ctx.reply("You are not authenticated...");
        }else{
            const get_rows = await googleSheets.spreadsheets.values.get({
                auth,
                spreadsheetId:ssId,
                range:"manpower"
            });
            let ans = get_rows.data.values;
            console.log(ans[0][0]);
            let finalArr=[];
            let props = ans[0];
            for(let i=0 ; i<ans.length ; i++){
                if(i===0) continue;
                let obj={};
                for(let j=0 ; j<ans[i].length ; j++){
                    obj[props[j]] =!ans[i][j]?"NA":ans[i][j];
                }
                finalArr.push(obj);
            }
            let array = finalArr.filter(e=>e["DIVISION"]==="TURA");
            let male=array.filter(e=>e["SEX"]=="M");
            let female=array.filter(e=>e["SEX"]=="F");
            let result=[];
            array.forEach(e=>{
                let temp=[];
                for (const key in e) {
                    if (Object.hasOwnProperty.call(e, key)) {
                        temp.push(e[key]);
                    }
                }
                result.push(temp);
            });
            // console.log(result[0][0]);
            const canvas = createCanvas(800,1500,'pdf');
            const c = canvas.getContext('2d');
            c.font = '10px Sans';
        
            let maxName = Number.MIN_VALUE;
            let maxId=8;
            let maxCat=14;
            let maxDept=Number.MIN_VALUE;
            let maxDes=Number.MIN_VALUE;
            let maxDiv=Number.MIN_VALUE;
            for(let i=0 ; i<ans.length ; i++){
                if(ans[i][1].length >maxName){
                    maxName = ans[i][1].length;
                }
                if(ans[i][2].length>maxDes)
                    maxDes = ans[i][2].length;
                if(ans[i][3].length>maxDiv)
                    maxDiv = ans[i][3].length;
                if(ans[i][4].length>maxDept)
                    maxDept = ans[i][4].length;
            }
            maxName+=2;
            maxDept+=2;
            maxDes+=2;
            maxDiv+=2;
           
           let str="A",totalRows=result.length,pdfRows=95,pages=Math.ceil(totalRows/pdfRows),r=0,end=95,it=0;
           let row=15,col=5;
           let first=false;
           let curr=0;
            while(it<pages){
                str="A";
                c.font = '10px Sans';
                if(it==0){
                    if(!first){
                        c.font = 'bold 10px Sans';
                        str="..";
                        first=true;
                        c.fillText(props[0],col,row);
                        c.fillText(props[1],c.measureText(str.repeat(maxId)).width,row);
                        c.fillText(props[2],c.measureText(str.repeat(maxId+maxName)).width,row);
                        c.fillText(props[3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,row);
                        c.fillText(props[4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,row);
                        c.fillText(props[5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,row);
                        c.fillText(props[6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,row);
                    }
                    c.font = '10px Sans';
                    str="A";
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++){
                        c.fillText(result[i][0],col,(i+2)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(i+2)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(i+2)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(i+2)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(i+2)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(i+2)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(i+2)*row);
                    }
                }else{
                    let gap=1;
                    c.addPage();
                    c.font = '10px Sans';
                    for(let i=r+curr ; i<curr+end && i<totalRows ; i++,gap++){
                        c.fillText(result[i][0],col,(gap)*row);
                        c.fillText(result[i][1],c.measureText(str.repeat(maxId)).width,(gap)*row);
                        c.fillText(result[i][2],c.measureText(str.repeat(maxId+maxName)).width,(gap)*row);
                        c.fillText(result[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,(gap)*row);
                        c.fillText(result[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,(gap)*row);
                        c.fillText(result[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,(gap)*row);
                        c.fillText(result[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,(gap)*row);   
                    }
                }
                curr+=end;
                it++;
            }
            fs.writeFileSync('data.pdf', canvas.toBuffer());
            ctx.telegram.sendDocument(ctx.from.id, {
                source: fs.readFileSync(pdfPath),
                filename: 'data.pdf'
            }).catch(function(error){ console.log(error); })
            ctx.replyWithMarkdown(`*Total Manpower* : ${array.length} \n*Male*:${male.length} \n*Female*:${female.length} \n*Sending full report please wait...*`);
        }
    })
    .catch(err=>console.log(err));
});

//authentication
async function authenticate(id){
    const get_rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId:ssId,
        range:"users"
    })
    // console.log(get_rows.data.values[0])
    let arr = get_rows.data.values[0];
    for(let i=0 ; i<arr.length ; i++){
        if(arr[i]===id) 
            return true;
    }
    return false;
}

bot.launch();