import fs from 'fs';
// import { configPath } from '../config/env.js';
const getUrl = (configName) => {
	return new URL(`./${configName}.json`, import.meta.url);
};
const wrightConfig = (configName, configData) => {
	try {
		fs.writeFileSync(getUrl(configName), JSON.stringify(configData));
	} catch (error) {
		console.log(error);
	}
};
const readConfig = (configName) => {
	try {
		return JSON.parse(fs.readFileSync(getUrl(configName)));
	} catch (error) {
		if (error.code === 'ENOENT') {
			return [];
		} else {
			console.log('myFs not ENOENT error');
			console.log(error);
		}
	}
};
const removeConfig = (configName) => {
	try {
		fs.unlinkSync(getUrl(configName));
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.log('config not exist');
		} else {
			console.log(error);
		}
	}
};

export { wrightConfig, readConfig, removeConfig };
