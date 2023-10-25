const { Extension, log, INPUT_METHOD, PLATFORMS } = require('deckboard-kit');
const { Query } = require('node-wmi');

const CATEGORIZATION = {
	load: {
		'Memory': 'ram', // Generic
		'CPU Total': 'cpu', // Generic
		'GPU Core': 'gpu', // NVidia
		'D3D 3D': 'gpu-backup' // Best approximation if actual load is missing
	},
	temperature: {
		'Core (Tctl/Tdie)': 'cpu', // AMD
		'CPU Package': 'cpu', // Intel
		'GPU Core': 'gpu', // NVidia
		'GPU Hot Spot': 'hotspot-gpu', // NVidia
		'VRM MOS': 'vrm' // from Motherboard if available
	},
	clock: {
		'GPU Core': 'gpu', // NVidia
		'GPU Memory': 'memory-gpu' // NVidia
	},
	power: {
		'Package': 'cpu', // AMD
		'CPU Package': 'cpu', // Intel
		'GPU Power': 'gpu', // Intel iGPU
		'GPU Package': 'gpu' // NVdia
	}
}

const SUFFIX = {
	load: '%',
	temperature: '°C',
	clock: ' MHz',
	power: ' W'
}

const DEFAULT_VALUE = {
	'hw-load-cpu': '-%',
	'hw-load-gpu': '-%',
	'hw-load-gpu-backup': '-%',
	'hw-load-ram': '-%',
	'hw-temperature-cpu': '-°C',
	'hw-temperature-gpu': '-°C',
	'hw-temperature-hotspot-gpu': '-°C',
	'hw-temperature-vrm': '-°C',
	'hw-clock-gpu': '-MHz',
	'hw-clock-memory-gpu': '-MHz',
	'hw-power-cpu': '-W',
	'hw-power-gpu': '-W'

}

class LibreHardwareMonitor extends Extension {
	constructor(props) {
		super(props);
		this.setValue = props.setValue;
		this.name = 'Hardware Monitor';
		this.platforms = [PLATFORMS.WINDOWS];

		this.inputs = [
			{
				label: 'Display CPU Stats',
				value: 'hw-cpu',
				icon: 'headphones',
				mode: 'custom-value',
				fontIcon: 'fas',
				color: '#8E44AD',
				input: [
					{
						label: 'Select monitor',
						type: INPUT_METHOD.INPUT_SELECT,
						items: [
							{ value: 'hw-load-cpu', label: 'CPU Load' },
							{ value: 'hw-temperature-cpu', label: 'CPU Temperature' },
							{ value: 'hw-power-cpu', label: 'CPU Power Draw' }
						]
					}
				]
			},
			{
				label: 'Display GPU Stats',
				value: 'hw-gpu',
				icon: 'headphones',
				mode: 'custom-value',
				fontIcon: 'fas',
				color: '#8E44AD',
				input: [
					{
						label: 'Select monitor',
						type: INPUT_METHOD.INPUT_SELECT,
						items: [
							{ value: 'hw-load-gpu', label: 'GPU Load' },
							{ value: 'hw-load-gpu-backup', label: 'GPU Load (backup solution)' },
							{ value: 'hw-temperature-gpu', label: 'GPU Temperature' },
							{ value: 'hw-temperature-hot-spot-gpu', label: 'GPU Hotspot Temperature' },
							{ value: 'hw-power-gpu', label: 'GPU Power Draw' },
							{ value: 'hw-clock-gpu', label: 'GPU Clock' },
							{ value: 'hw-clock-memory-gpu', label: 'GPU Memory Clock' }
						]
					}
				]
			},
			{
				label: 'Display RAM Stats',
				value: 'hw-load-ram',
				icon: 'headphones',
				mode: 'custom-value',
				fontIcon: 'fas',
				color: '#8E44AD'
			},
			{
				label: 'Display VRM Stats',
				value: 'hw-temperature-vrm',
				icon: 'headphones',
				mode: 'custom-value',
				fontIcon: 'fas',
				color: '#8E44AD'
			}
		];
		this.configs = [];
	}

	// Executes when the extensions loaded every time the app start.
	initExtension() {
		if (process.platform === 'win32')
			setInterval(() => {
					Query()
						.namespace('root/LibreHardwareMonitor')
						.class('Sensor')
						.where("SensorType ='Load' OR SensorType ='Temperature' OR SensorType = 'Clock' OR SensorType = 'Power'")
						.exec((err, data) => {
							if (err || !data)
								this.setValue(DEFAULT_VALUE)
							else this.setValue(data
								.filter(({ Name, SensorType }) => CATEGORIZATION[SensorType.toLowerCase()][Name] !== undefined)
								.map(({ Name, Value, SensorType }) => ({
									key: 'hw-' + SensorType.toLowerCase() + '-' + CATEGORIZATION[SensorType.toLowerCase()][Name],
									value: Math.round(Value) + SUFFIX[SensorType.toLowerCase()]
								}))
								.reduce((data, { key, value }) => ({ ...data, [key]: value }), DEFAULT_VALUE)
							)
						})
			}, 2000)
		else this.setValue(DEFAULT_VALUE)
	}

	execute(action, args) {
		return;
	};
}

module.exports = (sendData) => new LibreHardwareMonitor(sendData);