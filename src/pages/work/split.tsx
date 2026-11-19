import { Fragment } from 'react';

/** Each word in its own clipped box, so words can rise into place. */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="wd">
            <span className="wd-i">{word}</span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

/** Each letter in its own clipped box. Put an aria-label on the parent heading. */
export function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          <span className="chw" aria-hidden="true">
            {[...word].map((char, ci) => (
              <span className="ch" key={ci}>
                <span className="ch-i">{char}</span>
              </span>
            ))}
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}
