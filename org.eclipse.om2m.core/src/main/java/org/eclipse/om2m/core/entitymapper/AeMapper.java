/*******************************************************************************
 * Copyright (c) 2013-2016 LAAS-CNRS (www.laas.fr)
 * 7 Colonel Roche 31077 Toulouse - France
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Initial Contributors:
 *     Thierry Monteil : Project manager, technical co-manager
 *     Mahdi Ben Alaya : Technical co-manager
 *     Samir Medjiah : Technical co-manager
 *     Khalil Drira : Strategy expert
 *     Guillaume Garzone : Developer
 *     François Aïssaoui : Developer
 *
 * New contributors :
 *******************************************************************************/
package org.eclipse.om2m.core.entitymapper;

import java.math.BigInteger;

import org.eclipse.om2m.commons.constants.ResourceType;
import org.eclipse.om2m.commons.constants.ResultContent;
import org.eclipse.om2m.commons.entities.AccessControlPolicyEntity;
import org.eclipse.om2m.commons.entities.AeEntity;
import org.eclipse.om2m.commons.entities.ContainerEntity;
import org.eclipse.om2m.commons.entities.DynamicAuthorizationConsultationEntity;
import org.eclipse.om2m.commons.entities.FlexContainerEntity;
import org.eclipse.om2m.commons.entities.GroupEntity;
import org.eclipse.om2m.commons.entities.PollingChannelEntity;
import org.eclipse.om2m.commons.entities.SubscriptionEntity;
import org.eclipse.om2m.commons.resource.AE;
import org.eclipse.om2m.commons.resource.AccessControlPolicy;
import org.eclipse.om2m.commons.resource.ChildResourceRef;
import org.eclipse.om2m.commons.resource.Container;
import org.eclipse.om2m.commons.resource.DynamicAuthorizationConsultation;
import org.eclipse.om2m.commons.resource.AbstractFlexContainer;
import org.eclipse.om2m.commons.resource.Group;
import org.eclipse.om2m.commons.resource.PollingChannel;
import org.eclipse.om2m.commons.resource.Subscription;

public class AeMapper extends EntityMapper<AeEntity, AE> {

	@Override
	protected AE createResource() {
		return new AE();
	}

	@Override
	protected void mapAttributes(AeEntity entity, AE resource) {
		// AnnounceableResource attributes
		EntityMapperFactory.getAnnounceableSubordonateEntity_AnnounceableResourceMapper().mapAttributes(entity, resource);
		
		// Ae attributes
		resource.setAEID(entity.getAeid());
		resource.setAppID(entity.getAppID());
		resource.setAppName(entity.getAppName());
		resource.setNodeLink(entity.getNodeLink());
		resource.setOntologyRef(entity.getOntologyRef());
		if (!entity.getPointOfAccess().isEmpty()) {
			resource.getPointOfAccess().addAll(entity.getPointOfAccess());
		}
		resource.setRequestReachability(entity.isRequestReachability());
	}

	@Override
	protected void mapChildResourceRef(AeEntity entity, AE resource) {

		// ChildResourceRef ACP
		for (AccessControlPolicyEntity acpEntity : entity.getChildAccessControlPolicies()) {
			ChildResourceRef child = new ChildResourceRef();
			child.setResourceName(acpEntity.getName());
			child.setType(BigInteger.valueOf(ResourceType.ACCESS_CONTROL_POLICY));
			child.setValue(acpEntity.getResourceID());
			resource.getChildResource().add(child);
		}
		// ChildResourceRef Container
		for (ContainerEntity containerEntity : entity.getChildContainers()) {
			ChildResourceRef child = new ChildResourceRef();
			child.setResourceName(containerEntity.getName());
			child.setType(BigInteger.valueOf(ResourceType.CONTAINER));
			child.setValue(containerEntity.getResourceID());
			resource.getChildResource().add(child);
		}
		// ChildResourceRef FlexContainer
		for (FlexContainerEntity flexContainerEntity : entity.getChildFlexContainers()) {
			ChildResourceRef child = new ChildResourceRef();
			child.setResourceName(flexContainerEntity.getName());
			child.setType(flexContainerEntity.getResourceType());
			child.setValue(flexContainerEntity.getResourceID());
			child.setSpid(flexContainerEntity.getContainerDefinition());
			resource.getChildResource().add(child);
		}
		// ChildResourceRef Subscription
		for (SubscriptionEntity sub : entity.getSubscriptions()) {
			ChildResourceRef child = new ChildResourceRef();
			child.setResourceName(sub.getName());
			child.setType(BigInteger.valueOf(ResourceType.SUBSCRIPTION));
			child.setValue(sub.getResourceID());
			resource.getChildResource().add(child);
		}
		// ChildResourceRef Group
		for (GroupEntity group : entity.getChildGroups()) {
			ChildResourceRef child = new ChildResourceRef();
			child.setResourceName(group.getName());
			child.setType(BigInteger.valueOf(ResourceType.GROUP));
			child.setValue(group.getResourceID());
			resource.getChildResource().add(child);
		}
		// ChildResourceRef PollingChannel
		for (PollingChannelEntity pollEntity : entity.getPollingChannels()) {
			ChildResourceRef child = new ChildResourceRef();
			child.setResourceName(pollEntity.getName());
			child.setValue(pollEntity.getResourceID());
			child.setType(ResourceType.POLLING_CHANNEL);
			resource.getChildResource().add(child);
		}

		// adding DynamicAuthorizationConsultation refs
		for (DynamicAuthorizationConsultationEntity dace : entity.getChildDynamicAuthorizationConsultations()) {
			ChildResourceRef ch = new ChildResourceRef();
			ch.setResourceName(dace.getName());
			ch.setType(ResourceType.DYNAMIC_AUTHORIZATION_CONSULTATION);
			ch.setValue(dace.getResourceID());
			resource.getChildResource().add(ch);
		}
	}

	@Override
	protected void mapChildResources(AeEntity entity, AE resource) {
		// ChildResourceRef ACP
		for (AccessControlPolicyEntity acpEntity : entity.getChildAccessControlPolicies()) {
			AccessControlPolicy acpRes = new AcpMapper().mapEntityToResource(acpEntity, ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(acpRes);
		}
		// ChildResourceRef Container
		for (ContainerEntity containerEntity : entity.getChildContainers()) {
			Container cnt = new ContainerMapper().mapEntityToResource(containerEntity, ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(cnt);
		}
		// ChildResourceRef FlexContainer
		for (FlexContainerEntity flexContainerEntity : entity.getChildFlexContainers()) {
			AbstractFlexContainer fcnt = new FlexContainerMapper().mapEntityToResource(flexContainerEntity,
					ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(fcnt);
		}
		// ChildResourceRef Subscription
		for (SubscriptionEntity sub : entity.getSubscriptions()) {
			Subscription subRes = new SubscriptionMapper().mapEntityToResource(sub, ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(subRes);
		}
		// ChildResourceRef Group
		for (GroupEntity group : entity.getChildGroups()) {
			Group grp = new GroupMapper().mapEntityToResource(group, ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(grp);
		}
		// ChildResourceRef PollingChannel
		for (PollingChannelEntity pollEntity : entity.getPollingChannels()) {
			PollingChannel poll = new PollingChannelMapper().mapEntityToResource(pollEntity, ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(poll);
		}

		// adding DynamicAuthorizationConsultation resource
		for (DynamicAuthorizationConsultationEntity daceEntity : entity.getChildDynamicAuthorizationConsultations()) {
			DynamicAuthorizationConsultation dace = new DynamicAuthorizationConsultationMapper()
					.mapEntityToResource(daceEntity, ResultContent.ATTRIBUTES);
			resource.getContainerOrGroupOrAccessControlPolicy().add(dace);
		}
	}

}
