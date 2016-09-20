#!/usr/bin/env node

const fs = require('fs')
const exec = require('child_process').exec;
const reg = /\s([0-9]*)x([0-9]*)\s/;
const typeReg = /[0-9a-zA-Z]*\.([0-9a-zA-Z]*)\s/;
let fileList = [];

const makeFileList = () => {
	fs.readdir('.', (err, files) => {
		if (err) {
			console.log('read files error...')
		}
		files.forEach((file)=>{
			if(/jpeg|jpg|png/.test(file)){
				fileList.push(file);
			}
		})
		readFileInfo(fileList)
	});	
}

					
const readFileInfo = (fileList) => {
	fileList.forEach((file) => {
		 exec(`identify ${file}`,
			(error, stdout, stderr) => {
			if (error !== null) {
				console.log('get file list error....');
			}
			compress({
				file: file,
				type: typeReg.exec(stdout)[1],
				width: reg.exec(stdout)[1],
				height: reg.exec(stdout)[2]
			});
		});
	});
}

const compress = ({file, type, width, height}) => {
	exec(`mkdir uncompress`);
	exec(`cp ${file} ./uncompress/`, ()=>{
		exec(`rm ${file}`,() => {
			exec(`curl -F \"file=@./uncompress/${file};type=${type}/plain\" \"http://localhost:9000/crop?quality=80&width=${width}&height=${height}\" > ${file}`, (error, stdout, stderr)=>{
				if (error !== null) {
					console.log('compress error....');
				}
			})
		})
	});
}

makeFileList();
