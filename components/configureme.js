import VCHeader from './vcHeader';
import { Grid, GridItem, HeadingText, BlockText } from 'nr1';

export default function ConfigureMe() {
  return (<Grid>
      <GridItem columnSpan={12}>
        <VCHeader hideButton={true} />
      </GridItem>
      <GridItem columnSpan={12}>
        <HeadingText style={{ marginBottom: '20px', marginTop: '20px' }}>Integrate with VividCortex</HeadingText>
        <BlockText style={{ marginBottom: '20px'}}>
          Connecting your VividCortex account with New Relic. Let's get started!
        </BlockText>
        <BlockText>
          Set up this Nerdpack by configuring your
          organization's VividCortex URL. Edit the VIVIDCORTEX_URL in <code>CONFIGURE_ME.js</code> and come back here when you've saved the file. <em>Don't deploy this Nerdpack without proper configuration!</em>
        </BlockText>
      </GridItem>
    </Grid>);
}