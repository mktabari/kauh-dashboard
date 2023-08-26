import fs from 'fs';
import { configPath } from '../config/env.js';

const wrightConfig = (configName, configData) => {
	try {
		fs.writeFileSync(`${configPath}/${configName}.json`, JSON.stringify(configData));
	} catch (error) {
		console.log(error);
	}
};
const readConfig = (configName) => {
	try {
		return JSON.parse(fs.readFileSync(`${configPath}/${configName}.json`));
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.log('myFs ENOENT error');
			return undefined;
		} else {
			console.log('myFs not ENOENT error');
			console.log(error);
		}
	}
};
const removeConfig = (configName) => {
	try {
		fs.unlinkSync(`${configPath}/${configName}.json`);
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.log('config not exist');
		} else {
			console.log(error);
		}
	}
};

export { wrightConfig, readConfig, removeConfig };
