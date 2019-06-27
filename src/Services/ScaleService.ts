import { Dimensions } from 'react-native';

export class ScaleService {

  height: number = Dimensions.get('window').height;
  width: number = Dimensions.get('window').width;

  // Guideline sizes are based on standard ~5.5" screen mobile device
  // DON'T CHNAGE THIS GUIDELINE!!!!
  guidelineBaseWidth: number = 420;
  guidelineBaseHeight: number = 750;

  constructor() {
  }

  horizontal(size: number) {
    return this.width / this.guidelineBaseWidth * size;
  }

  vertical(size: number) {
    return this.height / this.guidelineBaseHeight * size;
  }

  moderate(size: number, factor: number = 0.5) {
    return size + ( this.horizontal(size) - size ) * factor;
  }
}
