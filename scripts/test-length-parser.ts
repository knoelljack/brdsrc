// Test the updated length parsing logic

function lengthParser(lengthText: string): string {
  // Handle "9'0 x 22 1/4'' x 3''" format from dimensions
  const match = lengthText.match(/(\d+)'(\d*)/);
  if (match) {
    const feet = match[1];
    const inches = match[2] || '0';
    // Handle inches properly - keep 10, 11 but limit others to single digit
    let cleanInches = inches;
    if (inches.length > 2) {
      cleanInches = inches[0]; // Take first digit if more than 2 digits
    } else if (inches.length === 2 && parseInt(inches) > 11) {
      cleanInches = inches[0]; // Take first digit if > 11 (invalid inches)
    }
    return `${feet}'${cleanInches}"`;
  }

  // Try to extract from full dimensions text like "9'0 x 22 1/4'' x 3''"
  const dimensionMatch = lengthText.match(/(\d+)'(\d*)\s*x/);
  if (dimensionMatch) {
    const feet = dimensionMatch[1];
    const inches = dimensionMatch[2] || '0';
    // Handle inches properly - keep 10, 11 but limit others to single digit
    let cleanInches = inches;
    if (inches.length > 2) {
      cleanInches = inches[0]; // Take first digit if more than 2 digits
    } else if (inches.length === 2 && parseInt(inches) > 11) {
      cleanInches = inches[0]; // Take first digit if > 11 (invalid inches)
    }
    return `${feet}'${cleanInches}"`;
  }

  // Handle simple number formats
  const numberMatch = lengthText.match(/^\d+$/);
  if (numberMatch) {
    const num = parseInt(numberMatch[0]);
    if (num >= 40 && num <= 120) {
      // Assume it's in format like "90" meaning 9'0"
      const feet = Math.floor(num / 10);
      const inches = num % 10;
      return `${feet}'${inches}"`;
    }
  }

  return lengthText || '0\'0"';
}

// Test cases
const testCases = [
  "9'0 x 22 1/4'' x 3''",
  "6'10 x 20'' x 2 5/8''",
  "5'4 x 18.5'' x 2.25''",
  '90',
  '64',
  '100',
  "9'0",
  "6'10",
  "5'4",
];

console.log('🧪 Testing updated length parser:');
console.log('='.repeat(50));

testCases.forEach(testCase => {
  const result = lengthParser(testCase);
  console.log(`Input: "${testCase}" -> Output: "${result}"`);
});

console.log('\n✅ Length parser testing complete!');
