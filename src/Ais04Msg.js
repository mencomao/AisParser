// @flow
import AisBitField from './AisBitField';
import AisMessage from './AisMessage';

const MOD_NAME = 'Ais04Msg';
const DEBUG = false;
const SUPPORTED_VALUES = [
  'aisType',
  'channel',
  'repeatInd',
  'mmsi',
  'latitude',
  'longitude',
  'posAccuracy',
  'utcYear',
  'utcMonth',
  'utcDay',
  'utcHour',
  'utcMinute',
  'utcSecond',
  'epfd'
];


/*
|==============================================================================
|Field   |Len  |Description      |Member   |T|Units
|0-5     |  6  |Message Type     |type     |u|Constant: 4
|6-7     |  2  |Repeat Indicator |repeat   |u|As in Common Navigation Block
|8-37    | 30  |MMSI             |mmsi     |u|9 decimal digits
|38-51   | 14  |Year (UTC)       |year     |u|UTC, 1-999, 0 = N/A (default)
|52-55   |  4  |Month (UTC)      |month    |u|1-12; 0 = N/A (default)
|56-60   |  5  |Day (UTC)        |day      |u|1-31; 0 = N/A (default)
|61-65   |  5  |Hour (UTC)       |hour     |u|0-23; 24 = N/A (default)
|66-71   |  6  |Minute (UTC)     |minute   |u|0-59; 60 = N/A (default)
|72-77   |  6  |Second (UTC)     |second   |u|0-59; 60 = N/A (default)
|78-78   |  1  |Fix quality      |accuracy |b|As in Common Navigation Block
|79-106  | 28  |Longitude        |lon      |I4|As in Common Navigation Block
|107-133 | 27  |Latitude         |lat      |I4|As in Common Navigation Block
|134-137 |  4  |Type of EPFD     |epfd     |e|See "EPFD Fix Types"
|138-147 | 10  |Spare            |         |x|Not used
// TODO
|148-148 |  1  |RAIM flag        |raim     |b|As for common navigation block
|149-167 | 19  |SOTDMA state     |radio    |u|As in same bits for Type 1
|==============================================================================
*/

export default class Ais04Msg extends AisMessage {
  constructor(aisType : number,bitField : AisBitField, channel : string) {
    super(aisType,bitField,channel);
    // TODO: check bitcount
    if(bitField.bits >= 167) {
      this._valid = 'VALID';
    } else {
      this._valid = 'INVALID';
      this._errMsg = 'invalid bitcount for type 04 msg:' + bitField.bits;
    }
  }

  get supportedValues() : Array<string> {
    return SUPPORTED_VALUES;
  }

  get utcYear() : number {
    return this._bitField.getInt(38,14,true);
  }

  get utcMonth() : number {
    return this._bitField.getInt(52,4,true);
  }

  get utcDay() : number {
    return this._bitField.getInt(56,5,true);
  }

  get utcHour() : number {
    return this._bitField.getInt(61,5,true);
  }

  get utcMinute() : number {
    return this._bitField.getInt(66,6,true);
  }

  get utcSecond() : number {
    return this._bitField.getInt(72,6,true);
  }

  get posAccuracy() : boolean {
    return this._bitField.getInt(78, 1, true) === 1;
  }

  _getRawLat() : number {
    return this._bitField.getInt(107,27,false);
  }

  _getRawLon() : number {
    return this._bitField.getInt(79,28,false);
  }

  get epfd() : number {
    return this._bitField.getInt(134,4,true);
  }

}
