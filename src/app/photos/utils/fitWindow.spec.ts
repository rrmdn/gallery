import fitWindow from "./fitWindow";

describe("fitWindow", () => {
  describe("given a portrait image", () => {
    const image = [300, 400];

    it("should fit the image to a laptop window", () => {
      const window = [1440, 900];
      const result = fitWindow(window[0], window[1], image[0], image[1]);
      expect(result).toEqual({ width: 675, height: 900 });
    });

    it("should fit the image to a phone window", () => {
      const window = [375, 667];
      const result = fitWindow(window[0], window[1], image[0], image[1]);
      expect(result).toEqual({ width: 375, height: 500 });
    });
  });

  describe("given a landscape image", () => {
    const image = [400, 300];

    it("should fit the image to a laptop window", () => {
      const window = [1440, 900];
      const result = fitWindow(window[0], window[1], image[0], image[1]);
      expect(result).toEqual({ width: 1200, height: 900 });
    });

    it("should fit the image to a phone window", () => {
      const window = [375, 667];
      const result = fitWindow(window[0], window[1], image[0], image[1]);
      expect(result).toEqual({ width: 375, height: 281.25 });
    });
  });
});
