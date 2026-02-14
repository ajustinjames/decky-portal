import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

const selectedCompositionFn = vi.fn(() => ({
  releaseComposition: vi.fn(),
}));

vi.mock('@decky/ui', () => ({
  findModuleChild: vi.fn((predicate: (m: unknown) => unknown) => {
    predicate('not-an-object');

    const wrongModule = { nope: () => 'not-a-match' };
    const matchedModule = {
      useComp: function useComp() {
        return 'AddMinimumCompositionStateRequest ChangeMinimumCompositionStateRequest RemoveMinimumCompositionStateRequest';
      },
    };

    const candidate = predicate(wrongModule) ?? predicate(matchedModule);
    return candidate ? selectedCompositionFn : selectedCompositionFn;
  }),
}));

describe('useUIComposition', () => {
  it('calls located composition function with requested composition', async () => {
    const module = await import('./use-ui-composition');

    module.useUIComposition(module.UIComposition.Overlay);

    expect(selectedCompositionFn).toHaveBeenCalledWith(module.UIComposition.Overlay);
  });

  it('proxy requests notification composition', async () => {
    const module = await import('./use-ui-composition');
    const spy = vi
      .spyOn(module, 'useUIComposition')
      .mockReturnValue({ releaseComposition: vi.fn() });

    render(<module.UICompositionProxy />);

    expect(spy).toHaveBeenCalledWith(module.UIComposition.Notification);
  });
});
