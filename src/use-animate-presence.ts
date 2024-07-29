import React from 'react';

import {UseAnimatePresenceProps, UseAnimatePresenceReturn} from './types';

/**
 * A hook for managing enter/exit animations with CSS classes.
 *
 * @param props - The configuration options for the hook
 * @returns An object containing the ref, animation class name, and visibility state
 *
 * @example
 * const MyComponent = () => {
 *   const { ref, animationClassName, visible } = useAnimatePresence({
 *     defaultVisible: true,
 *     animation: {
 *       enter: 'fade-in',
 *       exit: 'fade-out',
 *     },
 *     onExitComplete: () => console.log('Exit animation completed'),
 *   });
 *
 *   return (
 *     visible && (
 *       <div ref={ref} className={animationClassName}>
 *         Fade in/out content
 *       </div>
 *     )
 *   );
 * };
 */
const useAnimatePresence = ({
  defaultVisible = false,
  animation,
  onExitComplete,
}: UseAnimatePresenceProps): UseAnimatePresenceReturn => {
  const [state, setState] = React.useState(() => ({
    animationClassName: defaultVisible ? animation.enter : animation.exit,
    visible: defaultVisible,
  }));

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setState({
      animationClassName: defaultVisible ? animation.enter : animation.exit,
      visible: defaultVisible,
    });
  }, [defaultVisible, animation.enter, animation.exit]);

  const handleAnimationEnd = React.useCallback(() => {
    if (!defaultVisible) {
      setState(prevState => ({...prevState, visible: false}));
    }
  }, [defaultVisible]);

  React.useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('animationend', handleAnimationEnd);
      return () => {
        element.removeEventListener('animationend', handleAnimationEnd);
      };
    }
  }, [handleAnimationEnd]);

  React.useEffect(() => {
    if (!state.visible && !defaultVisible) {
      onExitComplete?.();
    }
  }, [state.visible, defaultVisible, onExitComplete]);

  return React.useMemo(
    () => ({
      ref,
      animationClassName: state.animationClassName,
      visible: state.visible,
    }),
    [state.animationClassName, state.visible],
  );
};

export default useAnimatePresence;
