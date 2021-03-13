import React, { useRef, useImperativeHandle } from 'react';

// test font on https

function StripeTextField({ component: Component, inputRef, ...props }) {
    const elementRef = useRef();

    useImperativeHandle(inputRef, () => ({
        focus: () => elementRef.current.focus
    }));

    return (
        <Component 
            onReady={element => (elementRef.current = element)} 
            options={{ 
                style: { 
                    base : { 
                        fontFamily: 'Lato, sans-serif',
                        fontSize: '15px', 
                        fontWeight: '300', 
                    } 
                } 
            }} 
            {...props} 
        />
    );
}

export default StripeTextField;
