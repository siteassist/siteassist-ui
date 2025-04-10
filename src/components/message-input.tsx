import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

const MessageInput = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<'textarea'>
>(({className, rows = 1, value, ...props}, ref) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => textAreaRef.current!);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0px';
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textAreaRef}
      rows={rows}
      value={value}
      className={className}
      {...props}
    />
  );
});

MessageInput.displayName = 'AutoHeightTextArea';

export default MessageInput;
