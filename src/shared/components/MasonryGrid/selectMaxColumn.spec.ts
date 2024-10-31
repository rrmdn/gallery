import selectMaxColumn from "./selectMaxColumn";

describe("selectMaxColumn", () => {
  it("should return 1 column for a container width of 320 or less", () => {
    expect(selectMaxColumn(5, 320)).toBe(1);
  });

  it("should return 2 columns for a container width of 321 to 480", () => {
    expect(selectMaxColumn(5, 321)).toBe(2);
    expect(selectMaxColumn(5, 480)).toBe(2);
  });

  it("should return 3 columns for a container width of 481 to 768", () => {
    expect(selectMaxColumn(5, 481)).toBe(3);
    expect(selectMaxColumn(5, 768)).toBe(3);
  });

  it("should return 4 columns for a container width of 769 to 1024", () => {
    expect(selectMaxColumn(5, 769)).toBe(4);
    expect(selectMaxColumn(5, 1024)).toBe(4);
  });

  it("should return 5 columns for a container width of more than 1024", () => {
    expect(selectMaxColumn(5, 1025)).toBe(5);
  });
});
