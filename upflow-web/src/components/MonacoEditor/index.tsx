import React, { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Flex, Select, theme, Divider } from 'antd';

const { useToken } = theme;

export interface CodeValue {
  language: string;
  script: string;
}

interface MonacoEditorProps {
  value?: CodeValue;
  onChange?: (value: CodeValue) => void;
  placeholder?: string;
  height?: number | string;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value = { language: 'javascript', script: '' },
  onChange,
  placeholder = '请输入代码...',
  height = 200,
  readOnly = false,
  style,
}) => {
  const { token } = useToken();
  const editorRef = useRef<any>(null);

  const handleKeyDownCapture = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // 阻止空格键事件向外层组件传播，避免被拦截
    if (e.key === ' ' || e.code === 'Space') {
      e.stopPropagation();
    }
  }, []);

  const handleKeyUpCapture = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.stopPropagation();
    }
  }, []);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    const newValue = {
      language: newLanguage,
      script: value.script
    };
    if (onChange) {
      onChange(newValue);
    }
  }, [value.script, onChange]);

  const handleScriptChange = useCallback((newScript: string | undefined) => {
    const newValue = {
      language: value.language,
      script: newScript || ''
    };
    if (onChange) {
      onChange(newValue);
    }
  }, [value.language, onChange]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    // 简化的主题配置
    monaco.editor.defineTheme('custom-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'scrollbar.shadow': 'transparent',
        'scrollbarSlider.background': '#c1c1c1',
        'scrollbarSlider.hoverBackground': '#a8a8a8',
        'scrollbarSlider.activeBackground': '#a8a8a8',
        'editorLineNumber.foreground': '#999999',
        'editorLineNumber.activeForeground': '#666666',
      },
    });
    
    monaco.editor.setTheme('custom-theme');
  };

  return (
    <div style={{ 
      overflow: 'hidden',
      border: `1px solid ${token.colorBorder}`, 
      borderRadius: token.borderRadius, 
      ...style 
    }}>
      <Flex align="center" style={{ height: '100%' }}>
        <Select
          variant='borderless'
          size={'small'}
          style={{ marginLeft: 8, width: 'auto' }}
          value={value.language}
          onChange={handleLanguageChange}
          placeholder="请选择语言"
          options={[
            { value: 'javascript', label: 'JavaScript' },
            { value: 'python', label: 'Python' },
          ]}
        />
      </Flex>
      <Divider style={{ margin: '0 0 8px 0' }} />
      
      <div onKeyDownCapture={handleKeyDownCapture} onKeyUpCapture={handleKeyUpCapture}>
      <Editor
        height={height}
        language={value.language}
        value={value.script}
        onChange={handleScriptChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 5,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 4,
            horizontalScrollbarSize: 8,
            verticalSliderSize: 4,
            horizontalSliderSize: 8,
          },
        }}
      />
      </div>
    </div>
  );
};

export default MonacoEditor;