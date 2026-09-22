import { useEffect, useRef, useState } from 'react';

/**
 * Runs an async function and tracks its state.
 *
 * Returns { data, error, isLoading } so a page can render a skeleton, an error
 * or the result without each one reimplementing the same three useStates.
 */
export default function useAsync(run, deps = []) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true });
  const [previousDeps, setPreviousDeps] = useState(deps);
  const runId = useRef(0);

  const depsChanged =
    deps.length !== previousDeps.length ||
    deps.some((dep, index) => !Object.is(dep, previousDeps[index]));

  // Adjusting state during render rather than in an effect: React applies it
  // before committing, so the stale result never reaches the screen. Doing the
  // same work in an effect would paint the previous request's data first and
  // then immediately re-render over it.
  if (depsChanged) {
    setPreviousDeps(deps);
    setState({ data: null, error: null, isLoading: true });
  }

  useEffect(() => {
    // Only the newest request may write. Filtering quickly would otherwise let
    // a slow "all pets" response land on top of the "cats" one the user
    // actually asked for.
    const id = ++runId.current;

    run()
      .then((data) => {
        if (runId.current === id) setState({ data, error: null, isLoading: false });
      })
      .catch((error) => {
        if (runId.current === id) setState({ data: null, error, isLoading: false });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
