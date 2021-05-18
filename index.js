const {google} = require('googleapis');
const {Telegraf} = require('telegraf');
const { createCanvas ,registerFont} = require('canvas');
const fs = require("fs");
const {table,getBorderCharacters} = require('table');

//creating bot
const bot_token = "1703319491:AAGozZLtkDJgxUPO3DNuKxP3BTQy_jZ38kg";
const bot = new Telegraf(bot_token);

registerFont('Lato-Bold.ttf', { family: 'Sans Serif' })
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
    ctx.reply(`Welcome ${ctx.from.first_name}\nCommands:\n`);
    // ctx.reply('{ "keyboard": [["uno :+1:"],["uno \ud83d\udc4d", "due"],["uno", "due","tre"],["uno", "due","tre","quattro"]]}'
    // );
});
bot.help(ctx=>{
    ctx.reply("help");
});
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
            ctx.replyWithMarkdown(`*---DIVISIONS---*\n1. /tipong\n2. /tikok\n3. /tirap\n4. /tura\n5. /guwahatiarea\n*Total Manpower* : ${finalArr.length}`);
        }
    })
    .catch(err=>ctx.reply(err.message));
});
bot.command('guwahatiarea',async ctx=>{
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
            let array = finalArr.filter(e=>e["DIVISION"]==="GUWAHATI" || e["DIVISION"]==="KOLKATA" ||e["DIVISION"]==="SILIGURI" ||e["DIVISION"]==="SIMSANG PROJECT");

            const canvas = createCanvas(800,1500,'pdf');
            const c = canvas.getContext('2d');
            c.font = '10px "Lato-Bold"';
            let row=15,col=5;

            // console.log(Number.MIN_VALUE)
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
           
           let str="A",totalRows=ans.length,pdfRows=80,pages=Math.ceil(totalRows/pdfRows),j=1;
           while(j<=pages) { 
               let i=0;
               while(i<=80 && i<ans.length){  
                   if(j!=1){
                       c.addPage();
                       c.font = '10px "Lato-Bold"';
                   }   
                   c.fillText(ans[i][0],col,i*row);
   
                   c.fillText(ans[i][1],c.measureText(str.repeat(maxId)).width,i*row);
   
                   c.fillText(ans[i][2],c.measureText(str.repeat(maxId+maxName)).width,i*row);
   
                   c.fillText(ans[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,i*row);
   
                   c.fillText(ans[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,i*row);
   
                   c.fillText(ans[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,i*row);
   
                   c.fillText(ans[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,i*row);
                }
                i++;
                j++;
           }
            // for(let i=0 ; i<ans.length ; i++){
            //     if(i%100==0){
            //         c.addPage();
            //         c.font = '10px "Luna-Bold"';
            //         c.fillText(ans[i][0],col,i*row);

            //         c.fillText(ans[i][1],c.measureText(str.repeat(maxId)).width,i*row);

            //         c.fillText(ans[i][2],c.measureText(str.repeat(maxId+maxName)).width,i*row);

            //         c.fillText(ans[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,i*row);

            //         c.fillText(ans[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,i*row);

            //         c.fillText(ans[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,i*row);

            //         c.fillText(ans[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,i*row);
            //     }

            //         c.fillText(ans[i][0],col,i*row);
    
            //         c.fillText(ans[i][1],c.measureText(str.repeat(maxId)).width,i*row);
    
            //         c.fillText(ans[i][2],c.measureText(str.repeat(maxId+maxName)).width,i*row);
    
            //         c.fillText(ans[i][3],c.measureText(str.repeat(maxId+maxName+maxDes)).width,i*row);
    
            //         c.fillText(ans[i][4],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv)).width,i*row);
    
            //         c.fillText(ans[i][5],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept)).width,i*row);
    
            //         c.fillText(ans[i][6],c.measureText(str.repeat(maxId+maxName+maxDes+maxDiv+maxDept+maxCat)).width,i*row);
                
            // }
            
            fs.writeFileSync('some.pdf', canvas.toBuffer())
            ctx.replyWithMarkdown(`*Total* : ${array.length}`);

        }
    })
    .catch(err=>ctx.reply(err.message));
});

async function authenticate(id){
    const get_rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId:ssId,
        range:"users"
    })
    // console.log(get_rows.data.values[0])
    let arr = get_rows.data.values[0];
    for(let i=0 ; i<arr.length ; i++){
        // console.log(arr[i])
        if(arr[i]===id) 
            return true;
    }
    return false;
}

bot.launch();


