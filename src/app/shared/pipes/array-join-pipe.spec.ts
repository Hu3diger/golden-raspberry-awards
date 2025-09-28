import { ArrayJoinPipe } from './array-join-pipe';

describe('ArrayJoinPipe', () => {
  let pipe: ArrayJoinPipe;

  beforeEach(() => {
    pipe = new ArrayJoinPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should join array with default separator (comma and space)', () => {
    const testArray = ['apple', 'banana', 'cherry'];
    const result = pipe.transform(testArray);
    
    expect(result).toBe('apple, banana, cherry');
  });

  it('should join array with custom separator', () => {
    const testArray = ['apple', 'banana', 'cherry'];
    const result = pipe.transform(testArray, ' | ');
    
    expect(result).toBe('apple | banana | cherry');
  });

  it('should handle single item array', () => {
    const testArray = ['apple'];
    const result = pipe.transform(testArray);
    
    expect(result).toBe('apple');
  });

  it('should handle empty array', () => {
    const testArray: string[] = [];
    const result = pipe.transform(testArray);
    
    expect(result).toBe('');
  });

  it('should handle null input', () => {
    const result = pipe.transform(null);
    
    expect(result).toBe('');
  });

  it('should handle undefined input', () => {
    const result = pipe.transform(undefined);
    
    expect(result).toBe('');
  });

  it('should handle array with string representations of different types', () => {
    const testArray = ['text', '123', 'true'];
    const result = pipe.transform(testArray);
    
    expect(result).toBe('text, 123, true');
  });

  it('should handle array with empty strings', () => {
    const testArray = ['', 'banana', ''];
    const result = pipe.transform(testArray);
    
    expect(result).toBe(', banana, ');
  });

  it('should join with semicolon separator', () => {
    const testArray = ['Studio A', 'Studio B', 'Studio C'];
    const result = pipe.transform(testArray, '; ');
    
    expect(result).toBe('Studio A; Studio B; Studio C');
  });

  it('should join with no space separator', () => {
    const testArray = ['A', 'B', 'C'];
    const result = pipe.transform(testArray, '');
    
    expect(result).toBe('ABC');
  });

  it('should handle special characters in separator', () => {
    const testArray = ['item1', 'item2', 'item3'];
    const result = pipe.transform(testArray, ' -> ');
    
    expect(result).toBe('item1 -> item2 -> item3');
  });
});
