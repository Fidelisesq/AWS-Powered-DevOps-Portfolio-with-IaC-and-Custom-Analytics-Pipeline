// Minimal test script with error handling
try {
    console.log('🚀 TEST: JavaScript is working!');
    console.error('🔍 TEST: This should appear in console');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✅ DOM loaded successfully');
        alert('JavaScript test successful!');
    });
} catch (error) {
    console.error('❌ JavaScript Error:', error);
}