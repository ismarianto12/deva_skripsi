import { useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const Editordata = ({ content, setContent }) => {
  const editor = useRef(null);

  useEffect(() => {
    if (editor.current) {
      editor.current.value = content;
    }
  }, [content]);

  const onBlur = useCallback(
    (newContent) => {
      setContent(newContent);
    },
    [setContent]
  );

  return (
    <JoditEditor
      value={content ? content : ''}
      ref={editor}
      tabIndex={1}
      onBlur={onBlur}
    />
  );
};

export default Editordata;
