import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Editor from '@monaco-editor/react';
import { PlayCircle, Code2, CheckCircle2, XCircle, BookOpen, Trash2 } from 'lucide-react';

interface ConsoleOutput {
  type: 'log' | 'error' | 'warn';
  message: string;
}

function App() {
  const [code, setCode] = useState(`const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled numbers:', doubled);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);

const evens = numbers.filter(n => n % 2 === 0);
console.log('Even numbers:', evens);`);

  const [output, setOutput] = useState<ConsoleOutput[]>([]);

  const runCode = () => {
    setOutput([]);
    
    try {
      // Create a custom console object
      const customConsole = {
        log: (...args: any[]) => {
          setOutput(prev => [...prev, {
            type: 'log',
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ')
          }]);
        },
        error: (...args: any[]) => {
          setOutput(prev => [...prev, {
            type: 'error',
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ')
          }]);
        },
        warn: (...args: any[]) => {
          setOutput(prev => [...prev, {
            type: 'warn',
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ')
          }]);
        }
      };

      // Execute the code with the custom console
      const executeCode = new Function('console', code);
      executeCode(customConsole);
    } catch (error: any) {
      setOutput([{
        type: 'error',
        message: `Error: ${error.message}`
      }]);
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return (
    <>
      <Helmet>
        <title>JS Playground - Interactive JavaScript Code Environment</title>
        <meta name="description" content="Interactive JavaScript playground for testing and experimenting with JavaScript code, array methods, and modern ES6+ features in real-time." />
        <meta name="keywords" content="JavaScript, ES6, Code Playground, Array Methods, JavaScript Libraries, Interactive Coding" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">JS Playground</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">JavaScript Code</h2>
                  <button
                    onClick={runCode}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Run Code
                  </button>
                </div>
                <div className="h-[400px]">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-light"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      folding: true,
                      lineDecorationsWidth: 0,
                      lineNumbersMinChars: 3,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Console Output</h2>
                  <button
                    onClick={clearOutput}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-gray-500" />
                    Clear Console
                  </button>
                </div>
                <div className="h-[400px] overflow-auto p-4 font-mono text-sm">
                  {output.map((item, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${
                        item.type === 'error' ? 'text-red-600' :
                        item.type === 'warn' ? 'text-yellow-600' :
                        'text-gray-800'
                      }`}
                    >
                      {item.type === 'error' && <XCircle className="inline-block mr-2 h-4 w-4" />}
                      {item.type === 'warn' && <BookOpen className="inline-block mr-2 h-4 w-4" />}
                      {item.type === 'log' && <CheckCircle2 className="inline-block mr-2 h-4 w-4" />}
                      <span className="font-mono">{item.message}</span>
                    </div>
                  ))}
                  {output.length === 0 && (
                    <p className="text-gray-500 italic">
                      Console output will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Guide</h2>
              <div className="prose prose-indigo">
                <ul className="space-y-2 text-gray-600">
                  <li>Write JavaScript code in the editor on the left</li>
                  <li>Use <code className="px-2 py-1 bg-gray-100 rounded">console.log()</code> to output results</li>
                  <li>Click "Run Code" to execute your code</li>
                  <li>Use "Clear Console" to clear the output</li>
                  <li>Try out array methods, modern ES6+ features, and more!</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;